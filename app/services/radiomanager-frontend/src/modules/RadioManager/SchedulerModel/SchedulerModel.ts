import { NowPlayingResource } from "@myownradio/domain/resources/NowPlayingResource"
import { RadioChannelModel } from "~/modules/RadioManager/RadioChannelModel"
import { SchedulerApiService } from "~/services/api/SchedulerApiService"
import { fromValue, Resource } from "~/utils/suspense2"

export class SchedulerModel {
  private nowPlayingResource: Resource<NowPlayingResource | null> = fromValue(null)

  constructor(
    private channelId: string,
    private radioChannelModel: RadioChannelModel,
    private schedulerApiService: SchedulerApiService,
  ) {
    void this.radioChannelModel
    this.syncNowPlaying()
  }

  private syncNowPlaying(): void {
    this.nowPlayingResource.replaceValue(this.schedulerApiService.getNowPlaying(this.channelId).catch(() => null))
  }

  public async start(): Promise<void> {
    await this.schedulerApiService.startChannel(this.channelId)
    this.syncNowPlaying()
  }

  public async stop(): Promise<void> {
    await this.schedulerApiService.stopChannel(this.channelId)
    this.nowPlayingResource.replaceValue(null)
  }
}
