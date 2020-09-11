import { RadioChannelResource } from "@myownradio/shared-types"
import { injectable } from "inversify"
import { observable, reaction, runInAction } from "mobx"
import { AuthenticationState } from "~/modules/Authentication"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { AuthenticationStore } from "~/store/AuthenticationStore"
import Debug from "~/utils/debug"
import { captureError } from "~/utils/sentry"

export abstract class RadioChannelsStore {
  public abstract radioChannels: RadioChannelResource[]

  public abstract init(): Promise<void>

  public abstract createRadioChannel(title: string): Promise<void>
}

@injectable()
export class RadioChannelsStoreImpl implements RadioChannelsStore {
  private debug = Debug.extend("RadioChannelsStoreImpl")

  @observable public radioChannels: RadioChannelResource[] = []

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private authenticationStore: AuthenticationStore,
  ) {
    reaction(
      () => this.authenticationStore.authentication,
      authentication => {
        if (authentication === AuthenticationState.AUTHENTICATED) {
          this.debug("Authentication state changed: calling init() again")

          this.init().catch(captureError)
        }
      },
    )
  }

  public async init(): Promise<void> {
    this.debug("Init")

    const channels = await this.radioManagerApiService.getChannels()

    runInAction(() => {
      this.radioChannels = channels
    })

    this.debug("Radio channels loaded", { channels })
  }

  public async createRadioChannel(title: string): Promise<void> {
    this.debug("Create radio channel", { title })

    const channelResource = await this.radioManagerApiService.createChannel(title)

    runInAction(() => {
      this.radioChannels.push(channelResource)
    })

    this.debug("Radio channel created", { channelResource })
  }
}
