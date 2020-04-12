import { AbstractApiService } from "./abstractApiService";

export interface TokenService {
  refreshRefreshToken(refreshToken: string): Promise<SuccessfulRefreshResponse>;
  forgotRefreshToken(refreshToken: string): Promise<void>;
}

export interface SuccessfulRefreshResponse {
  refresh_token: string;
  access_token: string;
}

export class BaseTokenService extends AbstractApiService implements TokenService {
  constructor(authApiUrl: string) {
    super(authApiUrl);
  }

  public async refreshRefreshToken(refreshToken: string): Promise<SuccessfulRefreshResponse> {
    const { body } = await this.makeRequest<SuccessfulRefreshResponse>("refreshToken", {
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

export function createTokenService(authApiUrl: string): TokenService {
  return new BaseTokenService(authApiUrl);
}
