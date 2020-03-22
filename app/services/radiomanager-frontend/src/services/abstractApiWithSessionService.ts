import axios, { AxiosRequestConfig } from "axios";
import { ILocaleKey } from "~/locales";
import isAccessTokenValid from "~/services/utils/isAccessTokenValid";
import { BadRequestError, EmailExistsError, UnknownError, UnauthorizedError } from "./errors";
import { SessionService } from "./sessionService";
import { AbstractApiService } from "~/services/abstractApiService";

type IStatusCodeToLocaleKeyMap = Partial<
  {
    [S in IHandledStatusCodes]: ILocaleKey;
  }
>;

type IHandledStatusCodes = 400 | 401 | 409;

export abstract class AbstractApiWithSessionService extends AbstractApiService {
  protected constructor(urlPrefix: string, private sessionService: SessionService) {
    super(urlPrefix);
  }

  protected async makeRequestWithRefresh<T>(
    path: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<T> {
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
  ): Promise<T> {
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
