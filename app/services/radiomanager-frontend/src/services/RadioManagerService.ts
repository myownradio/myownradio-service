import { SessionService } from "~/services/SessionService";
import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";

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
    const { body } = await this.makeRequestWithRefresh<RadioChannel[]>("channels", {
      method: "get",
    });

    return body;
  }

  public async createChannel(title: string): Promise<RadioChannel> {
    const { body } = await this.makeRequestWithRefresh<RadioChannel>("channels/create", {
      method: "post",
      data: { title },
    });

    return body;
  }

  public async getChannel(channelId: string | number): Promise<RadioChannel> {
    const rawChannelId = encodeURIComponent(channelId);
    const { body } = await this.makeRequestWithRefresh<RadioChannel>(`channels/${rawChannelId}`, {
      method: "get",
    });

    return body;
  }

  public async getAudioTracks(channelId: string | number): Promise<AudioTrack[]> {
    const rawChannelId = encodeURIComponent(channelId);
    const { body } = await this.makeRequestWithRefresh<AudioTrack[]>(`channels/${rawChannelId}/tracks`, {
      method: "get",
    });

    return body;
  }

  public async addTrackToChannel(
    channelId: string | number,
    signature: string,
    rawMetadata: string,
  ): Promise<AudioTrack> {
    const rawChannelId = encodeURIComponent(channelId);
    const { body } = await this.makeRequestWithRefresh<AudioTrack>(`channels/${rawChannelId}/tracks/add`, {
      method: "post",
      headers: {
        signature,
        "Content-Type": "application/json",
      },
      data: rawMetadata,
    });

    return body;
  }
}

export function createRadioManagerService(
  radioManagerUrl: string,
  sessionService: SessionService,
): RadioManagerService {
  return new BaseRadioManagerService(radioManagerUrl, sessionService);
}
