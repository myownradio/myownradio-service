import axios, { AxiosRequestConfig } from "axios";

import { ILocaleKey } from "~/locales";

import { BadRequestError, EmailExistsError, UnknownError, UnauthorizedError } from "./errors";

type IStatusCodeToLocaleKeyMap = Partial<
  {
    [S in IHandledStatusCodes]: ILocaleKey;
  }
>;

type IHandledStatusCodes = 400 | 401 | 409;

export type IApiServiceResponse<T> = {
  headers: { [name: string]: string };
  body: T;
};

export abstract class AbstractApiService {
  protected constructor(private urlPrefix: string) {}

  protected async makeRequest<T>(
    path: string,
    requestConfig: AxiosRequestConfig,
    statusCodeMap: IStatusCodeToLocaleKeyMap = {},
  ): Promise<IApiServiceResponse<T>> {
    const url = `${this.urlPrefix}${path}`;
    const config: AxiosRequestConfig = {
      withCredentials: true,
      validateStatus: () => true,
      ...requestConfig,
      url,
    };

    const { data, status, headers } = await axios(config);

    if (status === 200) {
      return { body: data, headers };
    }

    const responseText = typeof data === "string" ? data : JSON.stringify(data);

    if (status === 400) {
      throw new BadRequestError("Bad Request", statusCodeMap[400] || "api_error400");
    }

    if (status === 401) {
      throw new UnauthorizedError("Unauthorized", statusCodeMap[401] || "api_error401");
    }

    if (status === 409) {
      throw new EmailExistsError("Email Exists", statusCodeMap[409] || "api_error409");
    }

    throw new UnknownError(
      `Unknown Error. Original status - ${status}, Original response - ${responseText}`,
      "api_error",
    );
  }

  public isCancelledRequest(value: unknown): boolean {
    return axios.isCancel(value);
  }
}
