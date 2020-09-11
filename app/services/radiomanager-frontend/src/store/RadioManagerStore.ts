import { injectable } from "inversify"
import { runInAction } from "mobx"

export abstract class RadioManagerStore {
  public abstract initialized: boolean
  public abstract initPromise: Promise<void>

  public abstract init(): Promise<void>
}

@injectable()
export class RadioManagerStoreImpl implements RadioManagerStore {
  public initialized = false
  public initPromise: Promise<void>

  /**
   * The `initCallback` is initializing synchronously in constructor. But typescript is not
   * that ideal, so we need to add hint about this field will never be undefined.
   */
  private initCallback!: (error?: Error) => void

  constructor() {
    this.initPromise = new Promise((resolve, reject) => {
      this.initCallback = (error?: Error): void => (error ? reject(error) : resolve())
    })
  }

  public async init(): Promise<void> {
    try {
      await this.initInternal()

      runInAction(() => {
        this.initialized = true
      })

      this.initCallback && this.initCallback()
    } catch (error) {
      this.initCallback && this.initCallback(error)
    }
  }

  private async initInternal(): Promise<void> {}
}
