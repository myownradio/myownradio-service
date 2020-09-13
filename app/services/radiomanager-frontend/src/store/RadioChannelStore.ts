import { RadioChannelResource } from "@myownradio/shared-types"

export abstract class RadioChannelStore {
  public abstract start(): Promise<void>
  public abstract stop(): Promise<void>
  public abstract pause(): Promise<void>
  public abstract resume(): Promise<void>
}

export class RadioChannelStoreImpl implements RadioChannelStore {
  constructor(private radioChannelResource: RadioChannelResource) {}

  public async pause(): Promise<void> {
    return Promise.resolve()
  }

  public async resume(): Promise<void> {
    return Promise.resolve()
  }

  public async start(): Promise<void> {
    return Promise.resolve()
  }

  public async stop(): Promise<void> {
    return Promise.resolve()
  }
}
