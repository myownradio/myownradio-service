import { AbstractApiService } from "./abstractApiService";
import { SessionService } from "./sessionService";

export type ISuccessfulLoginResponse = {
  refresh_token: string;
  access_token: string;
};

export type ISuccessfulRefreshResponse = {
  refresh_token: string;
  access_token: string;
};

export type ISuccessfulMeResponse = {
  email: string;
};

export class AuthApiService extends AbstractApiService {
  constructor(authApiUrl: string, sessionService: SessionService) {
    super(authApiUrl, sessionService);
  }

  public async login(email: string, password: string): Promise<ISuccessfulLoginResponse> {
    return this.makeRequest<ISuccessfulLoginResponse>("login", {
      method: "post",
      data: { email, password },
    });
  }

  public async refreshRefreshToken(refreshToken: string): Promise<ISuccessfulRefreshResponse> {
    return this.makeRequest<ISuccessfulRefreshResponse>("refreshToken", {
      method: "post",
      data: { refresh_token: refreshToken },
    });
  }

  public async me(): Promise<ISuccessfulMeResponse> {
    return this.makeRequestWithRefresh<ISuccessfulMeResponse>("me", {
      method: "get",
    });
  }
}
