import { hashUtils } from "@myownradio/shared-server"
import { NowPlayingResource } from "@myownradio/shared-types"
import { AxiosInstance } from "axios"
import { inject, injectable } from "inversify"
import { Config } from "../config"
import { AxiosClientType, ConfigType } from "../di/types"
import { Metrics } from "../metrics"

export class RadioManagerClientError extends Error {}
export class ChannelNotFoundError extends RadioManagerClientError {}

export abstract class RadioManagerClient {
  public abstract getNowPlaying(channelId: number): Promise<NowPlayingResource>
}

@injectable()
export class RadioManagerClientImpl implements RadioManagerClient {
  constructor(
    @inject(AxiosClientType) private axios: AxiosInstance,
    @inject(ConfigType) private config: Config,
    private metrics: Metrics,
  ) {}

  public async getNowPlaying(channelId: number): Promise<NowPlayingResource> {
    const encodedChannelId = hashUtils.encodeId(channelId)
    const path = `channels/${encodedChannelId}/now`
    const url = `${this.config.radioManagerBackendUrl}/${path}`

    const end = this.metrics.radioManagerClientRequestsProcessingSummary.startTimer({
      method: "get",
      path: `channels/:channelId/now`,
    })

    try {
      const response = await this.axios.get<NowPlayingResource>(url)

      if (response.status === 404) {
        throw new ChannelNotFoundError("Channel not found or isn't streaming")
      }

      if (response.status >= 400) {
        throw new RadioManagerClientError(`Error: ${JSON.stringify(response.data)}`)
      }

      end({
        status_code: response.status,
      })

      return response.data
    } catch (error) {
      end({
        error_code: error.message,
      })
      throw error
    }
  }
}
