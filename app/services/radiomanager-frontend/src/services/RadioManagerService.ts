import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";
import { SessionService } from "~/services/sessionService";

export type IRadioChannel = {
  title: string;
  id: number;
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
}
