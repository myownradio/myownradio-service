import { AudioFileUploaderService } from "~/model/AudioFileUploaderService"
import { RadioChannelService } from "~/model/RadioChannelService"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { unwrapResource, wrapPromise } from "~/utils/suspense"

export class RadioManagerError extends Error {}

export class RadioManagerService {
  private channelsResource = wrapPromise(this.radioManagerApiService.getChannels())

  private radioChannelServices = new Map<string, RadioChannelService>()

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderService,
  ) {}

  private async getOrCreateRadioChannelService(channelId: string): Promise<RadioChannelService> {
    const channels = await unwrapResource(this.channelsResource)

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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.radioChannelServices.get(channelId)!
  }

  public async loadChannel(channelId: string): Promise<void> {
    await this.getOrCreateRadioChannelService(channelId)
  }

  public async deleteChannel(channelId: string): Promise<void> {
    if (!this.radioChannelServices.has(channelId)) return
    const probablyChannelService = this.radioChannelServices.get(channelId)
    if (probablyChannelService) {
      probablyChannelService.shutdown()
      // todo Implement channel deletion logic.
    } else {
      throw new RadioManagerError(`Channel ${channelId} not found`)
    }
  }

  public async createChannel(title: string): Promise<void> {
    const channel = await this.radioManagerApiService.createChannel(title)
    this.channelsResource.mutate(channels => [...channels, channel])
  }
}

export function createRadioManagerService(
  radioManagerApiService: RadioManagerApiService,
  audioFileUploaderService: AudioFileUploaderService,
): RadioManagerService {
  return new RadioManagerService(radioManagerApiService, audioFileUploaderService)
}
