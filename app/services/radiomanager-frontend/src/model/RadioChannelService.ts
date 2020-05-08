import { Subscription } from "rxjs"
import { filter } from "rxjs/operators"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import debug from "~/utils/debug"
import { wrapPromise } from "~/utils/suspense"
import { AudioFileUploaderService } from "./AudioFileUploaderService"

export class RadioChannelService {
  readonly audioTracksResource = wrapPromise(this.radioManagerApiService.getAudioTracks(this.channelId))

  private debug = debug.extend("RadioChannelService")
  private uploaderSubscription: Subscription

  constructor(
    private channelId: string,
    private radioManagerApiService: RadioManagerApiService,
    private audioFileUploaderService: AudioFileUploaderService,
  ) {
    this.uploaderSubscription = this.audioFileUploaderService.uploaderEvents
      .pipe(filter(({ channelId }) => channelId === this.channelId))
      .subscribe(({ audioTrackResource }) => {
        this.debug("Received event with new uploaded audio track", { audioTrackResource })
        this.audioTracksResource.mutate(audioTracks => {
          return [...audioTracks, audioTrackResource]
        })
      })
    this.debug("Channel service initialized", { channelId: this.channelId })
  }

  public async uploadAudioFile(audioFile: File): Promise<void> {
    this.audioFileUploaderService.enqueueAudioFile(this.channelId, audioFile)
    this.debug("Enqueued audio file", { audioFile })
  }

  public shutdown(): void {
    this.uploaderSubscription.unsubscribe()
    this.debug("Channel shutdown", { channelId: this.channelId })
  }
}
