import { AxiosRequestConfig } from "axios"
import { AbstractApiService } from "~/services/api/AbstractApiService"
import { isValidAccessToken } from "~/utils/jwt"
import { SessionService } from "../session/SessionService"
import UnauthorizedApiError from "./errors/UnauthorizedApiError"

export abstract class AbstractApiWithSessionService extends AbstractApiService {
  protected constructor(urlPrefix: string, private sessionService: SessionService) {
    super(urlPrefix)
  }

  protected async makeRequestWithRefresh<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    try {
      return await this.makeRequestWithAuthorization(path, requestConfig)
    } catch (error) {
      if (error instanceof UnauthorizedApiError) {
        await this.sessionService.refreshToken()
        return this.makeRequestWithAuthorization(path, requestConfig)
      }
      throw error
    }
  }

  private async makeRequestWithAuthorization<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    const accessToken = this.sessionService.getAccessToken()
    if (accessToken === null) {
      throw new UnauthorizedApiError()
    }

    if (!isValidAccessToken(accessToken)) {
      throw new UnauthorizedApiError()
    }

    const mergedHeaders = {
      Authorization: `Bearer ${accessToken}`,
      ...(requestConfig.headers || {}),
    }

    const mergedConfig = { ...requestConfig, headers: mergedHeaders }

    return this.makeRequest(path, mergedConfig)
  }
}
