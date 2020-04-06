import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";
import { SessionService } from "~/services/sessionService";

export type IRadioChannel = {
  title: string;
  id: number;
};

export type IAudioTrack = {
  id: number;
  name: string;
  artist: string;
  title: string;
  album: string;
  bitrate: number;
  duration: number;
};

export class RadioManagerService extends AbstractApiWithSessionService {
  constructor(radioManagerUrl: string, sessionService: SessionService) {
    super(radioManagerUrl, sessionService);
  }

  public async getChannels(): Promise<IRadioChannel[]> {
    const { body } = await this.makeRequestWithRefresh<IRadioChannel[]>("channels", {
      method: "get",
    });

    return body;
  }

  public async createChannel(title: string): Promise<IRadioChannel> {
    const { body } = await this.makeRequestWithRefresh<IRadioChannel>("channels/create", {
      method: "post",
      data: { title },
    });

    return body;
  }

  public async getChannel(channelId: string | number): Promise<IRadioChannel> {
    const rawChannelId = encodeURIComponent(channelId);
    const { body } = await this.makeRequestWithRefresh<IRadioChannel>(`channels/${rawChannelId}`, {
      method: "get",
    });

    return body;
  }

  public async getAudioTracks(channelId: string | number): Promise<IAudioTrack[]> {
    const rawChannelId = encodeURIComponent(channelId);
    const { body } = await this.makeRequestWithRefresh<IAudioTrack[]>(`channels/${rawChannelId}/tracks`, {
      method: "get",
    });

    return body;
  }
}
