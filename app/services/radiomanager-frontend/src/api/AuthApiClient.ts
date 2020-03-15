import { AbstractApiClientWithRefresh } from "./AbstractApiClientWithRefresh";
import { SessionService } from "../common/services/sessionService";

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

export class AuthApiClient extends AbstractApiClientWithRefresh {
  constructor(authServerUrl: string, sessionService: SessionService) {
    super(authServerUrl, sessionService);
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
