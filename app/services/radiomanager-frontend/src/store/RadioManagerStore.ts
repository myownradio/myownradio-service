import { injectable } from "inversify"
import { AuthenticationStore } from "~/store/AuthenticationStore"
import { RadioChannelsStore } from "~/store/RadioChannelsStore"
import Debug from "~/utils/debug"

export abstract class RadioManagerStore {
  public abstract init(): Promise<void>
}

@injectable()
export class RadioManagerStoreImpl implements RadioManagerStore {
  private debug = Debug.extend("RadioManagerStoreImpl")

  constructor(private authenticationStore: AuthenticationStore, private radioChannelsStore: RadioChannelsStore) {}

  public async init(): Promise<void> {
    this.debug("Init")
    await Promise.all([this.authenticationStore.init(), this.radioChannelsStore.init()])
  }
}
