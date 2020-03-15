import axios, { AxiosRequestConfig } from "axios";
import * as t from "io-ts";
import UnauthorizedError from "./errors/UnauthorizedError";
import UnknownError from "./errors/UnknownError";
import { StorageService } from "../common/services/storageService";

const LoginResponseContract = t.type({
  refresh_token: t.string,
  access_token: t.string,
});

export type ISuccessfulLoginResponse = t.TypeOf<typeof LoginResponseContract>;

export class AuthServer {
  constructor(private authServerUrl: string, private storageService: StorageService) {}

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

  public async login(email: string, password: string): Promise<ISuccessfulLoginResponse> {
    return this.makeRequest<ISuccessfulLoginResponse>("login", {
      method: "post",
      data: { email, password },
    });
  }
}
