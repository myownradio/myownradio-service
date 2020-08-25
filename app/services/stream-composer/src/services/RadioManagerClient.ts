import { hashUtils } from "@myownradio/shared-server"
import { NowPlayingResource } from "@myownradio/shared-types"
import { AxiosInstance } from "axios"
import { inject, injectable } from "inversify"
import { Config } from "../config"
import { AxiosClientType, ConfigType } from "../di/types"

export abstract class RadioManagerClient {
  public abstract getNowPlaying(channelId: number): Promise<NowPlayingResource>
}

@injectable()
export class RadioManagerClientImpl implements RadioManagerClient {
  constructor(@inject(AxiosClientType) private axios: AxiosInstance, @inject(ConfigType) private config: Config) {}

  public async getNowPlaying(channelId: number): Promise<NowPlayingResource> {
    const encodedChannelId = hashUtils.encodeId(channelId)
    const response = await this.axios.get<NowPlayingResource>(
      `${this.config.radioManagerBackendUrl}/channels/${encodedChannelId}/now`,
    )

    return response.data
  }
}
