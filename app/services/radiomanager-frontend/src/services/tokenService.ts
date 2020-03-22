import { AbstractApiService } from "./abstractApiService";
import { SessionService } from "./sessionService";

export type ISuccessfulRefreshResponse = {
  refresh_token: string;
  access_token: string;
};

export class TokenService extends AbstractApiService {
  constructor(authApiUrl: string, sessionService: SessionService) {
    super(authApiUrl, sessionService);
  }

  public async refreshRefreshToken(refreshToken: string): Promise<ISuccessfulRefreshResponse> {
    return this.makeRequest<ISuccessfulRefreshResponse>("refreshToken", {
      method: "post",
      data: { refresh_token: refreshToken },
    });
  }

  public async forgotRefreshToken(refreshToken: string): Promise<void> {
    await this.makeRequest<void>("forgotToken", {
      method: "post",
      data: { refresh_token: refreshToken },
    });
  }
}
