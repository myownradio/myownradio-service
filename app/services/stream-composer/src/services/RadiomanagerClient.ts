import { NowPlayingResource } from "@myownradio/shared-types"
import { injectable } from "inversify"

export abstract class RadiomanagerClient {
  public abstract getNowPlaying(channelId: number): NowPlayingResource
}

@injectable()
export class RadiomanagerClientImpl implements RadiomanagerClient {
  public async getNowPlaying(channelId: number): NowPlayingResource {
    return {}
  }
}
