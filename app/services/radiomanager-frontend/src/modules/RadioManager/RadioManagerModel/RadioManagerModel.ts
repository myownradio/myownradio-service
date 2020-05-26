import { RadioChannelResource } from "@myownradio/domain/resources"
import { AuthenticationEvent, AuthenticationModel } from "~/modules/Authentication"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import Debug from "~/utils/debug"
import { nop } from "~/utils/fn"
import { fromValue, Resource } from "~/utils/suspense2"
import { RadioChannelModel } from "../RadioChannelModel/RadioChannelModel"
import ChannelNotFoundError from "../errors/ChannelNotFoundError"
import ChannelsNotLoadedError from "../errors/ChannelsNotLoadedError"

export enum RadioManagerState {
  INITIAL = "INITIAL",
  READY = "READY",
  FAILURE = "FAILURE",
}

export interface RadioManagerModelInterface {
  createChannel(title: string): Promise<void>
  deleteChannel(channelId: string): Promise<void>
}

export class RadioManagerModel implements RadioManagerModelInterface {
  private debug = Debug.extend("RadioManagerModel")

  readonly radioManagerState = fromValue<RadioManagerState>(RadioManagerState.INITIAL)
  readonly radioManagerError = fromValue<Error | null>(null)

  readonly radioChannels = fromValue<RadioChannelResource[]>([])

  private radioChannelModels = new Map<string, Resource<RadioChannelModel>>()

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private authenticationModel: AuthenticationModel,
    private provideRadioChannelModel: (channelId: string) => RadioChannelModel,
  ) {
    this.authenticationModel.on(AuthenticationEvent.AUTHENTICATED, () => {
      this.loadChannels()
    })

    this.debug("Initialized")
  }

  public loadChannels(): void {
    this.debug("Loading channels...")

    this.cleanupBrokenRadioChannelModels()

    const radioChannelsPromise = this.radioManagerApiService.getChannels()

    this.radioManagerState.replaceValue(
      radioChannelsPromise
        .then(
          () => RadioManagerState.READY,
          () => RadioManagerState.FAILURE,
        )
        .then(newState => {
          this.debug(`State changed to ${newState}`)
          return newState
        }),
    )

    this.radioManagerError.replaceValue(
      radioChannelsPromise.then(
        () => null,
        error => error,
      ),
    )

    this.radioChannels.replaceValue(radioChannelsPromise)
  }

  private cleanupBrokenRadioChannelModels(): void {
    this.radioChannelModels.forEach((radioChannelModel, key) => {
      radioChannelModel.promise().catch(() => this.radioChannelModels.delete(key))
    })
  }

  public getRadioChannelModel(channelId: string): Resource<RadioChannelModel> {
    if (!this.radioChannelModels.has(channelId)) {
      const probablyRadioChannelModel = Promise.all([
        this.radioChannels.promise(),
        this.radioManagerState.promise(),
      ]).then(async ([radioChannels, state]) => {
        if (state !== RadioManagerState.READY) {
          this.debug("Channels not loaded")
          throw new ChannelsNotLoadedError(`Channels not loaded`)
        }

        if (radioChannels.every(({ id }) => id != channelId)) {
          this.debug(`Channel ${channelId} not found`)
          throw new ChannelNotFoundError(`Channel ${channelId} not found`)
        }

        return this.provideRadioChannelModel(channelId)
      })

      this.debug("Adding Radio Channel Model in pending state...")
      this.radioChannelModels.set(channelId, fromValue(probablyRadioChannelModel))
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.radioChannelModels.get(channelId)!
  }

  public async deleteChannel(channelId: string): Promise<void> {
    const probablyChannelService = this.radioChannelModels.get(channelId)
    if (probablyChannelService) {
      await probablyChannelService.promise().then(that => that.shutdown(), nop)
      this.radioChannelModels.delete(channelId)
      // todo Implement channel deletion logic.
    } else {
      throw new ChannelNotFoundError(`Channel ${channelId} not found`)
    }
  }

  public async createChannel(title: string): Promise<void> {
    this.cleanupBrokenRadioChannelModels()

    const channel = await this.radioManagerApiService.createChannel(title)
    this.radioChannels.enqueueMutation(channels => [...channels, channel])

    const probablyChannelService = this.radioChannelModels.get(channel.id)
    if (probablyChannelService) {
      await probablyChannelService.promise().catch(() => this.radioChannelModels.delete(channel.id))
    }
  }
}
