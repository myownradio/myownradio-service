import { AbstractApiWithSessionService } from "~/services/api/AbstractApiWithSessionService"
import { SessionService } from "../session/SessionService"

export interface AuthApiService {
  login(email: string, password: string): Promise<SuccessfulLoginResponse>
  signup(email: string, password: string): Promise<void>
  me(): Promise<SuccessfulMeResponse>
}

export interface SuccessfulLoginResponse {
  refresh_token: string
  access_token: string
}

export interface SuccessfulMeResponse {
  email: string
}

export class BaseAuthService extends AbstractApiWithSessionService implements AuthApiService {
  constructor(authApiUrl: string, sessionService: SessionService) {
    super(authApiUrl, sessionService)
  }

  public async login(email: string, password: string): Promise<SuccessfulLoginResponse> {
    return this.makeRequest<SuccessfulLoginResponse>("login", {
      method: "post",
      data: { email, password },
    })
  }

  public async signup(email: string, password: string): Promise<void> {
    await this.makeRequest<void>("signup", {
      method: "post",
      data: { email, password },
    })
  }

  public async me(): Promise<SuccessfulMeResponse> {
    return this.makeRequestWithRefresh<SuccessfulMeResponse>("me", {
      method: "get",
    })
  }
}

export function createAuthService(authApiUrl: string, sessionService: SessionService): AuthApiService {
  return new BaseAuthService(authApiUrl, sessionService)
}
