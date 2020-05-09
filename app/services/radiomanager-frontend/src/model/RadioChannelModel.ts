import { Subscription } from "rxjs"
import { filter } from "rxjs/operators"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
// import debug from "~/utils/debug"
import { fromValue } from "~/utils/suspense2"
import { AudioFileUploaderModel } from "./AudioFileUploaderModel"

export class RadioChannelModel {
  readonly audioTracksResource = fromValue(this.radioManagerApiService.getAudioTracks(this.channelId))

  // private debug = debug.extend("RadioChannelModel")
  private uploaderSubscription: Subscription

  constructor(
    private channelId: string,
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderModel,
  ) {
    this.uploaderSubscription = this.audioFileUploaderService.uploaderEvents
      .pipe(filter(({ channelId }) => channelId === this.channelId))
      .subscribe(({ audioTrackResource }) => {
        this.audioTracksResource.enqueueMutation(audioTracks => {
          return [...audioTracks, audioTrackResource]
        })
      })
  }

  public async uploadAudioFile(audioFile: File): Promise<void> {
    this.audioFileUploaderService.enqueueAudioFile(this.channelId, audioFile)
  }

  public shutdown(): void {
    this.uploaderSubscription.unsubscribe()
  }
}
