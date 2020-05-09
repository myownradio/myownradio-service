import { RadioChannelModel } from "~/model/RadioChannelModel"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
// import Debug from "~/utils/debug"
import { fromValue, unwrapValue } from "~/utils/suspense2"

export class RadioManagerError extends Error {}

export class RadioManagerModel {
  readonly channelsResource = fromValue(this.radioManagerApiService.getChannels())

  private radioChannelServices = new Map<string, RadioChannelModel>()
  // private debug = Debug.extend("RadioManagerModel")

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private getRadioChannelModel: (channelId: string) => RadioChannelModel,
  ) {}

  public reloadService(): void {
    this.channelsResource.replaceValue(this.radioManagerApiService.getChannels())
  }

  public async initializeRadioChannelService(channelId: string): Promise<void> {
    if (!this.radioChannelServices.has(channelId)) {
      const radioChannels = await unwrapValue(this.channelsResource)

      if (radioChannels.every(({ id }) => id !== channelId)) {
        throw new RadioManagerError(`Channel ${channelId} not found`)
      }

      const channelService = this.getRadioChannelModel(channelId)

      this.radioChannelServices.set(channelId, channelService)
    }
  }

  public getRadioChannelService(channelId: string): RadioChannelModel {
    if (!this.radioChannelServices.has(channelId)) {
      throw new RadioManagerError(`Channel ${channelId} isn't initialized`)
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.radioChannelServices.get(channelId)!
  }

  public async deleteChannel(channelId: string): Promise<void> {
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
    this.channelsResource.enqueueMutation(channels => [...channels, channel])
  }
}

export function createRadioManagerModel(
  radioManagerApiService: RadioManagerApiService,
  getRadioChannelModel: (channelId: string) => RadioChannelModel,
): RadioManagerModel {
  return new RadioManagerModel(radioManagerApiService, getRadioChannelModel)
}
