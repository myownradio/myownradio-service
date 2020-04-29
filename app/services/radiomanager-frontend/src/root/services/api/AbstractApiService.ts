import axios, { AxiosRequestConfig } from "axios"
import { UnauthorizedAPIError } from "~/root/services/api/errors/UnauthorizedAPIError"
import { UnknownAPIError } from "~/root/services/api/errors/UnknownAPIError"

export abstract class AbstractApiService {
  protected constructor(private urlPrefix: string) {}

  protected async makeRequest<T>(path: string, requestConfig: AxiosRequestConfig): Promise<T> {
    const url = `${this.urlPrefix}${path}`
    const config: AxiosRequestConfig = {
      withCredentials: true,
      validateStatus: () => true,
      ...requestConfig,
      url,
    }

    const { data, status } = await axios(config)

    if (status >= 400) {
      switch (status) {
        case 401:
          throw new UnauthorizedAPIError()

        default:
          throw new UnknownAPIError(status)
      }
    }

    return data
  }

  public isCancelledRequest(value: unknown): boolean {
    return axios.isCancel(value)
  }
}
