import { AudioFileUploaderModel } from "~/modules/AudioFileUploader"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import Debug from "~/utils/debug"
import { fromValue } from "~/utils/suspense2"

export class RadioChannelModel {
  readonly audioTracks = fromValue(this.radioManagerApiService.getAudioTracks(this.channelId))

  private debug = Debug.extend("RadioChannelModel")
  private readonly unsubscribe: () => void

  constructor(
    private channelId: string,
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderModel,
  ) {
    this.debug(`Initialized channel ${channelId}`)
    this.unsubscribe = this.audioFileUploaderService.on("AUDIO_FILE_UPLOADED", ({ audioTrackResource }) => {
      this.audioTracks.enqueueMutation(audioTracks => {
        return [...audioTracks, audioTrackResource]
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
