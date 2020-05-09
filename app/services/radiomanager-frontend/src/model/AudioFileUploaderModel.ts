import { AudioTrackResource } from "@myownradio/domain/resources/AudioTrackResource"
import axios, { CancelTokenSource } from "axios"
import { Subject } from "rxjs"
import { AudioUploaderApiService } from "~/services/api/AudioUploaderApiService"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { isCancelledRequest } from "~/utils/axios"
// import debug from "~/utils/debug"
import { nop } from "~/utils/fn"
import { unwrapResource, wrapValue } from "~/utils/suspense"

export interface UploadQueueItem {
  channelId: string
  audioFile: File
}

export interface UploadErrorItem {
  channelId: string
  audioFile: File
  reason: string
}

export interface AudioFileUploadedEvent {
  type: "AUDIO_FILE_UPLOADED"
  channelId: string
  audioTrackResource: AudioTrackResource
}

const CancelToken = axios.CancelToken

export class AudioFileUploaderModel {
  readonly uploadQueue = wrapValue<UploadQueueItem[]>([])
  readonly uploadErrors = wrapValue<UploadErrorItem[]>([])
  readonly uploaderEvents = new Subject<AudioFileUploadedEvent>()

  private busy = false
  // private debug = debug.extend("AudioFileUploaderModel")
  private cancelTokenSource: CancelTokenSource | null = null

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private audioUploaderApiService: AudioUploaderApiService,
  ) {}

  public enqueueAudioFile(channelId: string, audioFile: File): void {
    const newQueueItem: UploadQueueItem = { channelId, audioFile }

    this.uploadQueue.mutate(items => [...items, newQueueItem])

    if (!this.busy) {
      this.cancelTokenSource = CancelToken.source()
      this.uploadNextFile()
    }
  }

  private uploadNextFile(): void {
    unwrapResource(this.uploadQueue)
      .then(async uploadQueue => {
        if (uploadQueue.length === 0) {
          this.cancelTokenSource = null
          this.busy = false
          return
        }

        this.busy = true

        const [{ audioFile, channelId }, ...restFiles] = uploadQueue
        this.uploadQueue.mutate(() => restFiles)

        return this.audioUploaderApiService
          .uploadAudioFile(audioFile, {
            cancelToken: this.cancelTokenSource?.token,
          })
          .then(({ rawMetadata, signature }) =>
            this.radioManagerApiService.addTrackToChannel(channelId, signature, rawMetadata),
          )
          .then(() => this.uploadNextFile())
          .catch(error => {
            if (isCancelledRequest(error)) {
              this.uploadQueue.mutate(() => [])
              this.uploadErrors.mutate(() => [])
              this.cancelTokenSource = null
            } else {
              const errorItem: UploadErrorItem = {
                audioFile,
                channelId,
                reason: error.message,
              }
              this.uploadErrors.mutate(errors => [...errors, errorItem])
              this.uploadNextFile()
            }
          })
      })
      .catch(nop)
  }

  public abort(): void {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel()
      this.cancelTokenSource = null
    }
  }
}

export function createAudioFileUploaderModel(
  radioManagerApiService: RadioManagerApiService,
  audioUploaderApiService: AudioUploaderApiService,
): AudioFileUploaderModel {
  return new AudioFileUploaderModel(radioManagerApiService, audioUploaderApiService)
}
