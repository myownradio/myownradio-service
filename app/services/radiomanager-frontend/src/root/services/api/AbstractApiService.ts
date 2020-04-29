import axios, { AxiosRequestConfig } from "axios"
import AbstractErrorWithLocaleKey from "~/services/errors/AbstractErrorWithLocaleKey"
import { BadRequestError, UnknownError, UnauthorizedError } from "../../../services/errors"

interface StatusCodeToLocaleKeyMap {
  [statusCode: number]: <T>(body: T) => AbstractErrorWithLocaleKey
}

export abstract class AbstractApiService {
  protected constructor(private urlPrefix: string) {}

  protected async makeRequest<T>(
    path: string,
    requestConfig: AxiosRequestConfig,
    statusCodeToLocaleKeyMap: StatusCodeToLocaleKeyMap = {},
  ): Promise<T> {
    const url = `${this.urlPrefix}${path}`
    const config: AxiosRequestConfig = {
      withCredentials: true,
      validateStatus: () => true,
      ...requestConfig,
      url,
    }

    const { data, status } = await axios(config)

    if (status === 200) {
      return data
    }

    const responseText = typeof data === "string" ? data : JSON.stringify(data)

    if (status in statusCodeToLocaleKeyMap) {
      throw statusCodeToLocaleKeyMap[status](data)
    }

    if (status === 400) {
      throw new BadRequestError("Bad Request", "api_error400")
    }

    if (status === 401) {
      throw new UnauthorizedError("Unauthorized", "api_error401")
    }

    throw new UnknownError(
      `Unknown Error. Original status - ${status}, Original response - ${responseText}`,
      "api_error",
    )
  }

  public isCancelledRequest(value: unknown): boolean {
    return axios.isCancel(value)
  }
}
