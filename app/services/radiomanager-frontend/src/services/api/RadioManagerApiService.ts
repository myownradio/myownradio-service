import { AudioTrackResource, RadioChannelResource } from "@myownradio/shared-types"
import { AbstractApiWithSessionService } from "~/services/api/AbstractApiWithSessionService"
import { SessionService } from "~/services/session/SessionService"

export interface RadioManagerApiService {
  getChannels(): Promise<RadioChannelResource[]>
  createChannel(title: string): Promise<RadioChannelResource>
  getAudioTracks(channelId: string | number): Promise<AudioTrackResource[]>
  addTrackToChannel(channelId: string | number, signature: string, rawMetadata: string): Promise<AudioTrackResource>
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
}

export function createRadioManagerApiService(
  radioManagerUrl: string,
  sessionService: SessionService,
): RadioManagerApiService {
  return new BaseRadioManagerService(radioManagerUrl, sessionService)
}
