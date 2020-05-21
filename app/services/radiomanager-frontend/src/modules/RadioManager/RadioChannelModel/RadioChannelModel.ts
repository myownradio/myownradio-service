import { AudioFileUploaderModel } from "~/modules/AudioFileUploader"
import { SchedulerModel } from "~/modules/RadioManager/SchedulerModel"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import Debug from "~/utils/debug"
import { fromValue } from "~/utils/suspense2"

export class RadioChannelModel {
  readonly audioTracks = fromValue(this.radioManagerApiService.getAudioTracks(this.channelId))

  public schedulerModel: SchedulerModel = this.provideSchedulerModel(this.channelId, this)

  private debug = Debug.extend("RadioChannelModel")
  private readonly unsubscribe: () => void

  constructor(
    private channelId: string,
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderModel,
    private provideSchedulerModel: (channelId: string, radioChannelModel: RadioChannelModel) => SchedulerModel
  ) {
    this.debug(`Initialized channel ${channelId}`)
    this.unsubscribe = this.audioFileUploaderService.on("AUDIO_FILE_UPLOADED", ({ channelId, audioTrack }) => {
      if (channelId !== this.channelId) return

      this.audioTracks.enqueueMutation(audioTracks => {
        return [...audioTracks, audioTrack]
      })
    })
  }

  public async uploadAudioFile(audioFile: File): Promise<void> {
    this.audioFileUploaderService.enqueueAudioFile(this.channelId, audioFile)
  }

  public shutdown(): void {
    this.unsubscribe()
  }
}
