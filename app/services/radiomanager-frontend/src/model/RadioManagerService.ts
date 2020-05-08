import { AudioFileUploaderService } from "~/model/AudioFileUploaderService"
import { RadioChannelService } from "~/model/RadioChannelService"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import debug from "~/utils/debug"
import { unwrapResource, wrapPromise } from "~/utils/suspense"

export class RadioManagerError extends Error {}

export class RadioManagerService {
  readonly channelsResource = wrapPromise(this.radioManagerApiService.getChannels())

  private debug = debug.extend("RadioManagerService")

  private radioChannelServices = new Map<string, RadioChannelService>()

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderService,
  ) {
    this.debug("Initialized")

    unwrapResource(this.channelsResource).then(async channels => {
      if (channels.length > 0) {
        await this.loadChannel(channels[0].id)
      }
    })
  }

  private async getOrCreateRadioChannelService(channelId: string): Promise<RadioChannelService> {
    const channels = await unwrapResource(this.channelsResource)

    if (channels.every(({ id }) => id !== channelId)) {
      throw new RadioManagerError(`Channel ${channelId} not found`)
    }

    if (!this.radioChannelServices.has(channelId)) {
      this.debug("Creating RadioChannelService", { channelId })
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
    const probablyChannelService = this.radioChannelServices.get(channelId)
    if (probablyChannelService) {
      this.debug("Deleting channel", { channelId })
      probablyChannelService.shutdown()
      // todo Implement channel deletion logic.
    } else {
      throw new RadioManagerError(`Channel ${channelId} not found`)
    }
  }

  public async createChannel(title: string): Promise<void> {
    this.debug("Creating new channel", { title })
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
