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
  STANDBY = "STANDBY",
  READY = "READY",
  FAILURE = "FAILURE",
}

export class RadioManagerModel {
  readonly radioManagerState = fromValue<RadioManagerState>(RadioManagerState.STANDBY)
  readonly channels = fromValue<RadioChannelResource[]>([])
  readonly radioManagerError = fromValue<Error | null>(null)

  private radioChannelModels = new Map<string, Resource<RadioChannelModel>>()
  private debug = Debug.extend("RadioManagerModel")

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private authenticationModel: AuthenticationModel,
    private provideRadioChannelModel: (channelId: string) => RadioChannelModel,
  ) {
    this.authenticationModel.on(AuthenticationEvent.AUTHENTICATED, () => {
      this.loadChannels()
    })

    this.authenticationModel.on(AuthenticationEvent.LOGGED_OUT, () => {
      this.unloadChannels()
    })

    this.debug("Initialized")
  }

  public loadChannels(): void {
    this.debug("Loading channels...")

    this.cleanupBrokenRadioChannelModels()

    const channelsPromise = this.radioManagerApiService.getChannels()

    this.radioManagerState.replaceValue(
      channelsPromise
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
      channelsPromise.then(
        () => null,
        error => error,
      ),
    )

    this.channels.replaceValue(channelsPromise)
  }

  public unloadChannels(): void {
    this.debug("Unloading channels...")

    this.radioChannelModels.forEach((radioChannel, key) => {
      radioChannel.promise().then(that => that.shutdown(), nop)
      this.radioChannelModels.delete(key)
    })

    this.radioManagerState.replaceValue(RadioManagerState.STANDBY)
    this.radioManagerError.replaceValue(null)
    this.channels.replaceValue([])
  }

  private cleanupBrokenRadioChannelModels(): void {
    this.radioChannelModels.forEach((radioChannelModel, key) => {
      radioChannelModel.promise().catch(() => this.radioChannelModels.delete(key))
    })
  }

  public getRadioChannelModel(channelId: string): Resource<RadioChannelModel> {
    if (!this.radioChannelModels.has(channelId)) {
      const probablyRadioChannelModel = Promise.all([this.channels.promise(), this.radioManagerState.promise()]).then(
        async ([channels, state]) => {
          if (state !== RadioManagerState.READY) {
            this.debug("Channels not loaded")
            throw new ChannelsNotLoadedError(`Channels not loaded`)
          }

          if (channels.every(({ id }) => id != channelId)) {
            this.debug(`Channel ${channelId} not found`)
            throw new ChannelNotFoundError(`Channel ${channelId} not found`)
          }

          return this.provideRadioChannelModel(channelId)
        },
      )

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
    this.channels.enqueueMutation(channels => [...channels, channel])

    const probablyChannelService = this.radioChannelModels.get(channel.id)
    if (probablyChannelService) {
      await probablyChannelService.promise().catch(() => this.radioChannelModels.delete(channel.id))
    }
  }
}
