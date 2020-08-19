import { AudioTrackResource, NowPlayingResource, RadioChannelResource } from "@myownradio/shared-types"
import { AbstractApiWithSessionService } from "~/services/api/AbstractApiWithSessionService"
import { SessionService } from "~/services/session/SessionService"

export interface RadioManagerApiService {
  getChannels(): Promise<RadioChannelResource[]>
  createChannel(title: string): Promise<RadioChannelResource>
  getAudioTracks(channelId: string | number): Promise<AudioTrackResource[]>
  addTrackToChannel(channelId: string | number, signature: string, rawMetadata: string): Promise<AudioTrackResource>
  startChannel(channelId: string): Promise<void>
  stopChannel(channelId: string): Promise<void>
  pauseChannel(channelId: string): Promise<void>
  resumeChannel(channelId: string): Promise<void>
  getNowPlaying(channelId: string): Promise<NowPlayingResource>
}

export class BaseRadioManagerService extends AbstractApiWithSessionService implements RadioManagerApiService {
  constructor(radioManagerUrl: string, sessionService: SessionService) {
    super(radioManagerUrl, sessionService)
  }

  public async getChannels(): Promise<RadioChannelResource[]> {
    return this.makeRequestWithRefresh<RadioChannelResource[]>("channels", {
      method: "get",
    })
  }

  public async createChannel(title: string): Promise<RadioChannelResource> {
    return this.makeRequestWithRefresh<RadioChannelResource>("channels/create", {
      method: "post",
      data: { title },
    })
  }

  public async getAudioTracks(channelId: string | number): Promise<AudioTrackResource[]> {
    const rawChannelId = encodeURIComponent(channelId)
    return this.makeRequestWithRefresh<AudioTrackResource[]>(`channels/${rawChannelId}/tracks`, {
      method: "get",
    })
  }

  public async addTrackToChannel(
    channelId: string | number,
    signature: string,
    rawMetadata: string,
  ): Promise<AudioTrackResource> {
    const rawChannelId = encodeURIComponent(channelId)
    return this.makeRequestWithRefresh<AudioTrackResource>(`channels/${rawChannelId}/tracks`, {
      method: "post",
      headers: {
        signature,
        "Content-Type": "application/json",
      },
      data: rawMetadata,
    })
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
    return this.makeRequestWithRefresh(`channels/${channelId}/now`, {})
  }
}

export function createRadioManagerApiService(
  radioManagerUrl: string,
  sessionService: SessionService,
): RadioManagerApiService {
  return new BaseRadioManagerService(radioManagerUrl, sessionService)
}
