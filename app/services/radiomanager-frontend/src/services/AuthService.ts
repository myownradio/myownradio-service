import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";

import { SessionService } from "./SessionService";

interface AuthService {
  login(email: string, password: string): Promise<SuccessfulLoginResponse>;
  signup(email: string, password: string): Promise<void>;
  me(): Promise<SuccessfulMeResponse>;
}

export interface SuccessfulLoginResponse {
  refresh_token: string;
  access_token: string;
}

export interface SuccessfulMeResponse {
  email: string;
}

export class BaseAuthService extends AbstractApiWithSessionService implements AuthService {
  constructor(authApiUrl: string, sessionService: SessionService) {
    super(authApiUrl, sessionService);
  }

  public async login(email: string, password: string): Promise<SuccessfulLoginResponse> {
    const { body } = await this.makeRequest<SuccessfulLoginResponse>(
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

    return body;
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

  public async me(): Promise<SuccessfulMeResponse> {
    const { body } = await this.makeRequestWithRefresh<SuccessfulMeResponse>("me", {
      method: "get",
    });
    return body;
  }
}

export function createAuthService(authApiUrl: string, sessionService: SessionService): AuthService {
  return new BaseAuthService(authApiUrl, sessionService);
}
