import { EventEmitter } from "events"
import { AudioTrackResource } from "@myownradio/shared-types"
import axios, { CancelTokenSource } from "axios"
import { AuthenticationModel } from "~/modules/Authentication"
import { AuthenticationEvent } from "~/modules/Authentication/AuthenticationModel/AuthenticationModel"
import { AudioUploaderApiService } from "~/services/api/AudioUploaderApiService"
import { RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { isCancelledRequest } from "~/utils/axios"
import Debug from "~/utils/debug"
import { nop } from "~/utils/fn"
import { fromValue } from "~/utils/suspense2"

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
  audioTrack: AudioTrackResource
}

const CancelToken = axios.CancelToken

export class AudioFileUploaderModel {
  readonly uploadQueue = fromValue<UploadQueueItem[]>([])
  readonly uploadErrors = fromValue<UploadErrorItem[]>([])

  private busy = false
  private debug = Debug.extend("AudioFileUploaderModel")
  private cancelTokenSource: CancelTokenSource | null = null

  private emitter = new EventEmitter()

  constructor(
    private radioManagerApiService: RadioManagerApiService,
    private audioUploaderApiService: AudioUploaderApiService,
    private authenticationModel: AuthenticationModel,
  ) {
    this.debug("Initialized")

    this.authenticationModel.on(AuthenticationEvent.LOGGED_OUT, () => {
      this.debug("Cancel pending uploads due to logout")
      this.abort()
    })
  }

  public on<T extends AudioFileUploadedEvent>(event: T["type"], listener: (event: T) => void): () => void {
    this.emitter.addListener(event, listener)
    return (): void => {
      this.emitter.removeListener(event, listener)
    }
  }

  public enqueueAudioFile(channelId: string, audioFile: File): void {
    const newQueueItem: UploadQueueItem = { channelId, audioFile }
    this.debug("Enqueue new upload", newQueueItem)
    this.uploadQueue.enqueueMutation(items => [...items, newQueueItem])

    if (!this.busy) {
      this.busy = true
      this.cancelTokenSource = CancelToken.source()
      this.uploadNextFile()
    }
  }

  private uploadNextFile(): void {
    this.uploadQueue
      .promise()
      .then(async uploadQueue => {
        if (uploadQueue.length === 0) {
          this.debug("Queue is empty")

          this.cancelTokenSource = null
          this.busy = false
          return
        }

        this.debug("Uploading next file...")

        const [{ audioFile, channelId }, ...restFiles] = uploadQueue

        this.uploadQueue.enqueueMutation(() => restFiles)

        return this.audioUploaderApiService
          .uploadAudioFile(audioFile, {
            cancelToken: this.cancelTokenSource?.token,
          })
          .then(({ rawMetadata, signature }) =>
            this.radioManagerApiService.addTrackToChannel(channelId, signature, rawMetadata),
          )
          .then(audioTrack => {
            this.emitter.emit("AUDIO_FILE_UPLOADED", { channelId, audioTrack })
          })
          .then(() => this.uploadNextFile())
          .catch(error => {
            if (isCancelledRequest(error)) {
              this.debug("Upload cancelled")
              this.uploadQueue.replaceValue([])
              this.uploadErrors.replaceValue([])
              this.cancelTokenSource = null
            } else {
              const errorItem: UploadErrorItem = {
                audioFile,
                channelId,
                reason: error.message,
              }
              this.uploadErrors.enqueueMutation(errors => [...errors, errorItem])
              this.uploadNextFile()
            }
          })
      })
      .catch(nop)
  }

  public abort(): void {
    if (this.cancelTokenSource) {
      this.debug("Cancel upload")
      this.cancelTokenSource.cancel()
      this.cancelTokenSource = null
    }
  }
}
