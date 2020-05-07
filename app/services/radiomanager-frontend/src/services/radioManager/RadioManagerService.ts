import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { AudioFileUploaderService } from "~/services/radioManager/AudioFileUploaderService"
import { RadioChannelService } from "~/services/radioManager/RadioChannelService"
import { doWithResource, wrapPromise } from "~/utils/suspense"

export class RadioManagerError extends Error {}

export class RadioManagerService {
  private channelsResource = wrapPromise(this.radioManagerApiService.getChannels())

  private radioChannelServices = new Map<string, RadioChannelService>()

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderService,
  ) {}

  public loadChannel(channelId: string): Promise<void> {
    return doWithResource(this.channelsResource, async channels => {
      if (channels.every(({ id }) => id !== channelId)) {
        throw new RadioManagerError(`Channel ${channelId} not found`)
      }

      if (!this.radioChannelServices.has(channelId)) {
        const channelService = new RadioChannelService(
          channelId,
          this.radioManagerApiService,
          this.audioFileUploaderService,
        )

        this.radioChannelServices.set(channelId, channelService)
      }
    })
  }

  public async getChannelService(channelId: string): Promise<RadioChannelService> {
    await this.loadChannel(channelId)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.radioChannelServices.get(channelId)!
  }

  public async deleteChannel(channelId: string): Promise<void> {
    if (!this.radioChannelServices.has(channelId)) return
    const probablyChannelService = this.radioChannelServices.get(channelId)
    if (probablyChannelService) probablyChannelService.shutdown()
    // todo Implement channel deletion logic.
  }

  public async createChannel(title: string): Promise<void> {
    const channel = await this.radioManagerApiService.createChannel(title)
    this.channelsResource.mutate(channels => [...channels, channel])
  }
}
