import { AxiosRequestConfig } from "axios";

import { AbstractApiService, IApiServiceResponse } from "~/services/abstractApiService";
import isAccessTokenValid from "~/services/utils/isAccessTokenValid";

import { UnauthorizedError } from "./errors";
import { SessionService } from "./sessionService";

export abstract class AbstractApiWithSessionService extends AbstractApiService {
  protected constructor(urlPrefix: string, private sessionService: SessionService) {
    super(urlPrefix);
  }

  protected async makeRequestWithRefresh<T>(
    path: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<IApiServiceResponse<T>> {
    try {
      return await this.makeRequestWithAuthorization(path, requestConfig);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        await this.sessionService.refreshToken();
        return this.makeRequestWithAuthorization(path, requestConfig);
      }
      throw e;
    }
  }

  private async makeRequestWithAuthorization<T>(
    path: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<IApiServiceResponse<T>> {
    const accessToken = this.sessionService.getAccessToken();
    if (accessToken === null) {
      throw new UnauthorizedError(`No access token found`, "api_error401");
    }
    if (!isAccessTokenValid(accessToken)) {
      throw new UnauthorizedError(`Invalid access token`, "api_error401");
    }
    const mergedHeaders = {
      Authorization: `Bearer ${accessToken}`,
      ...(requestConfig.headers || {}),
    };
    const mergedConfig = { ...requestConfig, headers: mergedHeaders };
    return this.makeRequest(path, mergedConfig);
  }
}
