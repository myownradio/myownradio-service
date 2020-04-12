import { AbstractApiWithSessionService } from "~/services/AbstractApiWithSessionService";
import { BadRequestError, EmailExistsError, UnauthorizedError } from "~/services/errors";
import { SessionService } from "./SessionService";

export interface AuthService {
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
    return this.makeRequest<SuccessfulLoginResponse>(
      "login",
      {
        method: "post",
        data: { email, password },
      },
      {
        400: () => new BadRequestError("Some request parameters are wrong", "api_login_error400"),
        401: () => new UnauthorizedError("Wrong login or password", "api_login_error401"),
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
        400: () => new BadRequestError("Some request parameters are wrong", "api_signup_error400"),
        409: () => new EmailExistsError("Email already used", "api_signup_error409"),
      },
    );
  }

  public async me(): Promise<SuccessfulMeResponse> {
    return this.makeRequestWithRefresh<SuccessfulMeResponse>("me", {
      method: "get",
    });
  }
}

export function createAuthService(authApiUrl: string, sessionService: SessionService): AuthService {
  return new BaseAuthService(authApiUrl, sessionService);
}
