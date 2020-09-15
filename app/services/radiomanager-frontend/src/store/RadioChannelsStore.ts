import { RadioChannelResource } from "@myownradio/shared-types"
import { injectable } from "inversify"
import { observable, reaction, runInAction } from "mobx"
import { AuthenticationState } from "~/modules/Authentication"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { AuthenticationStore } from "~/store/AuthenticationStore"
import Debug from "~/utils/debug"
import { captureError } from "~/utils/sentry"

export abstract class RadioChannelsStore {
  public abstract radioChannels: Promise<RadioChannelResource[]>

  public abstract init(): Promise<void>

  public abstract createChannel(title: string): Promise<void>
  public abstract deleteChannel(channelId: string): Promise<void>
}

@injectable()
export class RadioChannelsStoreImpl implements RadioChannelsStore {
  private debug = Debug.extend("RadioChannelsStoreImpl")

  @observable public radioChannels: Promise<RadioChannelResource[]> = Promise.resolve([])

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private authenticationStore: AuthenticationStore,
  ) {
    reaction(
      () => this.authenticationStore.authentication,
      async authentication => {
        if ((await authentication) === AuthenticationState.AUTHENTICATED) {
          this.debug("Authentication state changed: calling init() again")

          this.init().catch(captureError)
        }
      },
    )
  }

  public async init(): Promise<void> {
    this.debug("Init")

    runInAction(() => {
      this.radioChannels = this.radioManagerApiService.getChannels()
    })

    this.debug("Radio channels loaded", { channels: this.radioChannels })
  }

  public async createChannel(title: string): Promise<void> {
    this.debug("Create radio channel", { title })

    runInAction(() => {
      this.radioChannels = this.radioChannels.then(async radioChannels => {
        const channelResource = await this.radioManagerApiService.createChannel(title)
        this.debug("Radio channel created", { channelResource })
        return [...radioChannels, channelResource]
      })
    })
  }

  public async deleteChannel(channelId: string): Promise<void> {
    // todo delete channel
    runInAction(() => {
      this.radioChannels = this.radioChannels.then(radioChannels => radioChannels.filter(({ id }) => id !== channelId))
    })
  }
}
