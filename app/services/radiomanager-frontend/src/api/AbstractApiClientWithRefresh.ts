import axios, { AxiosRequestConfig } from "axios";
import UnauthorizedError from "./errors/UnauthorizedError";
import UnknownError from "./errors/UnknownError";
import { getTopCancelTokenSource, isAccessTokenValid } from "./utils";
import { SessionService } from "../common/services/sessionService";

export abstract class AbstractApiClientWithRefresh {
  protected constructor(private urlPrefix: string, private sessionService: SessionService) {}

  protected async makeRequest<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    const cancelTokenSource = getTopCancelTokenSource();
    const url = `${this.urlPrefix}${path}`;
    const config: AxiosRequestConfig = {
      withCredentials: true,
      validateStatus: () => true,
      ...requestConfig,
      url,
    };

    if (cancelTokenSource) {
      config.cancelToken = cancelTokenSource.token;
    }

    const { data, status } = await axios(config);

    if (status === 200) {
      return data;
    }

    const responseText = typeof data === "string" ? data : JSON.stringify(data);

    if (status === 400) {
      throw new UnauthorizedError(`Bad request. Original response - ${responseText}`);
    }

    if (status === 401) {
      throw new UnauthorizedError(`Unauthorized. Original response - ${responseText}`);
    }

    throw new UnknownError(
      `Unknown error occurred on API request. Original status - ${status}, Original response - ${responseText}`,
    );
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
      throw new UnauthorizedError(`No access token found. Request didn't made.`);
    }
    if (!isAccessTokenValid(accessToken)) {
      throw new UnauthorizedError(`Invalid access token. Request didn't made.`);
    }
    const mergedHeaders = {
      Authorization: `Bearer ${accessToken}`,
      ...(requestConfig.headers || {}),
    };
    const mergedConfig = { ...requestConfig, headers: mergedHeaders };
    return this.makeRequest(path, mergedConfig);
  }
}
