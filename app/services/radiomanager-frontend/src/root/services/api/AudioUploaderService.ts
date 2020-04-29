import { CancelToken } from "axios"
import { AbstractApiWithSessionService } from "~/root/services/api/AbstractApiWithSessionService"
import { SessionService } from "~/root/services/session/SessionService"

export interface AudioUploaderService {
  uploadAudioFile(source: File): Promise<SuccessfulUploadResponse>
  uploadAudioFile(source: File, options: UploadAudioOptions): Promise<SuccessfulUploadResponse>
}

export interface AudioFileMetadata {
  hash: string
  size: number
  name: string
  duration: number
  bitrate: number
  format: string
  artist: string
  title: string
  album: string
  genre: string
}

export interface SuccessfulUploadResponse {
  signature: string
  metadata: AudioFileMetadata
  rawMetadata: string
}

export interface UploadAudioOptions {
  cancelToken?: CancelToken
  onProgress?: (loaded: number, total: number) => void
}

export class BaseAudioUploaderService extends AbstractApiWithSessionService implements AudioUploaderService {
  constructor(audioUploaderUrl: string, sessionService: SessionService) {
    super(audioUploaderUrl, sessionService)
  }

  public async uploadAudioFile(source: File, options: UploadAudioOptions = {}): Promise<SuccessfulUploadResponse> {
    const formData = new FormData()
    formData.append("source", source)

    return this.makeRequestWithRefresh<SuccessfulUploadResponse>("upload", {
      method: "post",
      data: formData,
      transformResponse: (rawMetadata, { signature }) => ({
        signature,
        rawMetadata,
        metadata: JSON.parse(rawMetadata),
      }),
      cancelToken: options.cancelToken,
      onUploadProgress(progressEvent: ProgressEvent) {
        options.onProgress && options.onProgress(progressEvent.loaded, progressEvent.total)
      },
    })
  }
}

export function createAudioUploaderService(
  audioUploaderUrl: string,
  sessionService: SessionService,
): AudioUploaderService {
  return new BaseAudioUploaderService(audioUploaderUrl, sessionService)
}
