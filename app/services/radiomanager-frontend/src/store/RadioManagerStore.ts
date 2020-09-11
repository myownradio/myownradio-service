import { injectable } from "inversify"
import { runInAction } from "mobx"
import { AuthenticationStore } from "~/store/AuthenticationStore"
import { RadioChannelsStore } from "~/store/RadioChannelsStore"
import Debug from "~/utils/debug"

export abstract class RadioManagerStore {
  public abstract initialized: boolean
  public abstract initPromise: Promise<void>

  public abstract init(): Promise<void>
}

@injectable()
export class RadioManagerStoreImpl implements RadioManagerStore {
  private debug = Debug.extend("RadioManagerStoreImpl")

  public initialized = false
  public readonly initPromise: Promise<void>

  /**
   * The `initCallback` is initializing synchronously in constructor. But typescript is not
   * that ideal, so we need to add hint about this field will never be undefined.
   */
  private initCallback!: (error?: Error) => void

  constructor(private authenticationStore: AuthenticationStore, private radioChannelsStore: RadioChannelsStore) {
    this.initPromise = new Promise((resolve, reject) => {
      this.initCallback = (error?: Error): void => (error ? reject(error) : resolve())
    })
  }

  public async init(): Promise<void> {
    this.debug("Init")

    try {
      await this.initInternal()

      runInAction(() => {
        this.initialized = true
      })

      this.initCallback && this.initCallback()
      this.debug("Initialized")
    } catch (error) {
      this.initCallback && this.initCallback(error)
      this.debug("Init failed")
    }
  }

  private async initInternal(): Promise<void> {
    await this.authenticationStore.init()
    await this.radioChannelsStore.init()
  }
}
