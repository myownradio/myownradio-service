import axios, { AxiosRequestConfig } from "axios";
import * as t from "io-ts";
import UnauthorizedError from "./errors/UnauthorizedError";
import UnknownError from "./errors/UnknownError";

const LoginResponseContract = t.type({
  refresh_token: t.string,
  access_token: t.string,
});

export type ISuccessfulLoginResponse = t.TypeOf<typeof LoginResponseContract>;

export class AuthServer {
  constructor(private authServerUrl: string) {}

  private async makeRequest<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    const url = `${this.authServerUrl}${path}`;
    const { data, status } = await axios({
      ...requestConfig,
      withCredentials: true,
      validateStatus: () => true,
      url,
    });

    if (status === 200) {
      return data;
    }

    const responseText = typeof data === "string" ? data : JSON.stringify(data);

    if (status === 401) {
      throw new UnauthorizedError(
        `Unauthorized error on API request. Original response - ${responseText}`,
      );
    }

    throw new UnknownError(
      `Unknown error occurred on API request. Original status - ${status}, Original response - ${responseText}`,
    );
  }

  public async login(email: string, password: string): Promise<ISuccessfulLoginResponse> {
    return this.makeRequest<ISuccessfulLoginResponse>("login", {
      data: { email, password },
    });
  }
}
