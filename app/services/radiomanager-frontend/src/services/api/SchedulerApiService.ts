import { NowPlayingResource } from "@myownradio/shared-types"
import { AbstractApiWithSessionService } from "~/services/api/AbstractApiWithSessionService"
import { SessionService } from "~/services/session/SessionService"

export class SchedulerApiService extends AbstractApiWithSessionService {
  constructor(schedulerApiUrl: string, sessionService: SessionService) {
    super(schedulerApiUrl, sessionService)
  }

  public startChannel(channelId: string): Promise<void> {
    return this.makeRequestWithRefresh(`channels/${channelId}/start`, {
      method: "post",
    })
  }

  public stopChannel(channelId: string): Promise<void> {
    return this.makeRequestWithRefresh(`channels/${channelId}/stop`, {
      method: "post",
    })
  }

  public pauseChannel(channelId: string): Promise<void> {
    return this.makeRequestWithRefresh(`channels/${channelId}/pause`, {
      method: "post",
    })
  }

  public resumeChannel(channelId: string): Promise<void> {
    return this.makeRequestWithRefresh(`channels/${channelId}/resume`, {
      method: "post",
    })
  }

  public getNowPlaying(channelId: string): Promise<NowPlayingResource> {
    return this.makeRequestWithRefresh(`channels/${channelId}/nowPlaying`, {})
  }
}
