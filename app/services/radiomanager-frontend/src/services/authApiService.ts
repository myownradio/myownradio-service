import { AbstractApiService } from "./abstractApiService";
import { SessionService } from "./sessionService";

export type ISuccessfulLoginResponse = {
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
    return this.makeRequest<ISuccessfulLoginResponse>(
      "login",
      {
        method: "post",
        data: { email, password },
      },
      {
        400: "api_login_error400",
        401: "api_login_error401",
      },
    );
  }

  public async signup(email: string, password: string): Promise<void> {
    await this.makeRequest<void>(
      "signup",
      {
        method: "post",
        data: { email, password },
      },
      {
        400: "api_signup_error400",
        409: "api_signup_error409",
      },
    );
  }

  public async me(): Promise<ISuccessfulMeResponse> {
    return this.makeRequestWithRefresh<ISuccessfulMeResponse>("me", {
      method: "get",
    });
  }
}
