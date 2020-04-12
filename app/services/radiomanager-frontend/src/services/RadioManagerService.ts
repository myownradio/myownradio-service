import { AbstractApiWithSessionService } from "~/services/AbstractApiWithSessionService";
import { SessionService } from "~/services/SessionService";

export interface RadioManagerService {
  getChannels(): Promise<RadioChannel[]>;
  createChannel(title: string): Promise<RadioChannel>;
  getChannel(channelId: string | number): Promise<RadioChannel>;
  getAudioTracks(channelId: string | number): Promise<AudioTrack[]>;
  addTrackToChannel(channelId: string | number, signature: string, rawMetadata: string): Promise<AudioTrack>;
}

export interface RadioChannel {
  title: string;
  id: number;
}

export interface AudioTrack {
  id: number;
  name: string;
  artist: string;
  title: string;
  album: string;
  bitrate: number;
  duration: number;
}

export class BaseRadioManagerService extends AbstractApiWithSessionService implements RadioManagerService {
  constructor(radioManagerUrl: string, sessionService: SessionService) {
    super(radioManagerUrl, sessionService);
  }

  public async getChannels(): Promise<RadioChannel[]> {
    return this.makeRequestWithRefresh<RadioChannel[]>("channels", {
      method: "get",
    });
  }

  public async createChannel(title: string): Promise<RadioChannel> {
    return this.makeRequestWithRefresh<RadioChannel>("channels/create", {
      method: "post",
      data: { title },
    });
  }

  public async getChannel(channelId: string | number): Promise<RadioChannel> {
    const rawChannelId = encodeURIComponent(channelId);
    return this.makeRequestWithRefresh<RadioChannel>(`channels/${rawChannelId}`, {
      method: "get",
    });
  }

  public async getAudioTracks(channelId: string | number): Promise<AudioTrack[]> {
    const rawChannelId = encodeURIComponent(channelId);
    return this.makeRequestWithRefresh<AudioTrack[]>(`channels/${rawChannelId}/tracks`, {
      method: "get",
    });
  }

  public async addTrackToChannel(
    channelId: string | number,
    signature: string,
    rawMetadata: string,
  ): Promise<AudioTrack> {
    const rawChannelId = encodeURIComponent(channelId);
    return this.makeRequestWithRefresh<AudioTrack>(`channels/${rawChannelId}/tracks/add`, {
      method: "post",
      headers: {
        signature,
        "Content-Type": "application/json",
      },
      data: rawMetadata,
    });
  }
}

export function createRadioManagerService(
  radioManagerUrl: string,
  sessionService: SessionService,
): RadioManagerService {
  return new BaseRadioManagerService(radioManagerUrl, sessionService);
}
