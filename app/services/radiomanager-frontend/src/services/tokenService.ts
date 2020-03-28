import { AbstractApiService } from "./abstractApiService";

export type ISuccessfulRefreshResponse = {
  refresh_token: string;
  access_token: string;
};

export class TokenService extends AbstractApiService {
  constructor(authApiUrl: string) {
    super(authApiUrl);
  }

  public async refreshRefreshToken(refreshToken: string): Promise<ISuccessfulRefreshResponse> {
    const { body } = await this.makeRequest<ISuccessfulRefreshResponse>("refreshToken", {
      method: "post",
      data: { refresh_token: refreshToken },
    });
    return body;
  }

  public async forgotRefreshToken(refreshToken: string): Promise<void> {
    await this.makeRequest<void>("forgotToken", {
      method: "post",
      data: { refresh_token: refreshToken },
    });
  }
}
