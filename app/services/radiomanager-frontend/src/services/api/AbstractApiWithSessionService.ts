import { AxiosRequestConfig } from "axios"
import { AbstractApiService } from "~/services/api/AbstractApiService"
import { UnauthorizedAPIError } from "~/services/api/errors/UnauthorizedAPIError"
import { isValidAccessToken } from "~/utils/jwt"
import { SessionService } from "../session/SessionService"

export abstract class AbstractApiWithSessionService extends AbstractApiService {
  protected constructor(urlPrefix: string, private sessionService: SessionService) {
    super(urlPrefix)
  }

  protected async makeRequestWithRefresh<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    try {
      return await this.makeRequestWithAuthorization(path, requestConfig)
    } catch (e) {
      if (e instanceof UnauthorizedAPIError) {
        await this.sessionService.refreshToken()
        return this.makeRequestWithAuthorization(path, requestConfig)
      }
      throw e
    }
  }

  private async makeRequestWithAuthorization<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    const accessToken = this.sessionService.getAccessToken()
    if (accessToken === null) {
      throw new UnauthorizedAPIError()
    }

    if (!isValidAccessToken(accessToken)) {
      throw new UnauthorizedAPIError()
    }

    const mergedHeaders = {
      Authorization: `Bearer ${accessToken}`,
      ...(requestConfig.headers || {}),
    }

    const mergedConfig = { ...requestConfig, headers: mergedHeaders }

    return this.makeRequest(path, mergedConfig)
  }
}
