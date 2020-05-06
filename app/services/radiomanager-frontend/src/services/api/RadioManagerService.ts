import { AbstractApiWithSessionService } from "~/services/api/AbstractApiWithSessionService"
import { SessionService } from "~/services/session/SessionService"

export interface RadioManagerService {
  getChannels(): Promise<RadioManagerRadioChannel[]>
  createChannel(title: string): Promise<RadioManagerRadioChannel>
  getChannel(channelId: string | number): Promise<RadioManagerRadioChannel>
  getAudioTracks(channelId: string | number): Promise<RadioManagerAudioTrack[]>
  addTrackToChannel(channelId: string | number, signature: string, rawMetadata: string): Promise<RadioManagerAudioTrack>
}

export interface RadioManagerRadioChannel {
  title: string
  id: number
}

export interface RadioManagerAudioTrack {
  id: number
  name: string
  artist: string
  title: string
  album: string
  bitrate: number
  duration: number
}

export class BaseRadioManagerService extends AbstractApiWithSessionService implements RadioManagerService {
  constructor(radioManagerUrl: string, sessionService: SessionService) {
    super(radioManagerUrl, sessionService)
  }

  public async getChannels(): Promise<RadioManagerRadioChannel[]> {
    return this.makeRequestWithRefresh<RadioManagerRadioChannel[]>("channels", {
      method: "get",
    })
  }

  public async createChannel(title: string): Promise<RadioManagerRadioChannel> {
    return this.makeRequestWithRefresh<RadioManagerRadioChannel>("channels/create", {
      method: "post",
      data: { title },
    })
  }

  public async getChannel(channelId: string | number): Promise<RadioManagerRadioChannel> {
    const rawChannelId = encodeURIComponent(channelId)
    return this.makeRequestWithRefresh<RadioManagerRadioChannel>(`channels/${rawChannelId}`, {
      method: "get",
    })
  }

  public async getAudioTracks(channelId: string | number): Promise<RadioManagerAudioTrack[]> {
    const rawChannelId = encodeURIComponent(channelId)
    return this.makeRequestWithRefresh<RadioManagerAudioTrack[]>(`channels/${rawChannelId}/tracks`, {
      method: "get",
    })
  }

  public async addTrackToChannel(
    channelId: string | number,
    signature: string,
    rawMetadata: string,
  ): Promise<RadioManagerAudioTrack> {
    const rawChannelId = encodeURIComponent(channelId)
    return this.makeRequestWithRefresh<RadioManagerAudioTrack>(`channels/${rawChannelId}/tracks/add`, {
      method: "post",
      headers: {
        signature,
        "Content-Type": "application/json",
      },
      data: rawMetadata,
    })
  }
}

export function createRadioManagerService(
  radioManagerUrl: string,
  sessionService: SessionService,
): RadioManagerService {
  return new BaseRadioManagerService(radioManagerUrl, sessionService)
}
