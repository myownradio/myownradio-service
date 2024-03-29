import { CancelToken } from "axios"
import { AbstractApiWithSessionService } from "~/services/api/AbstractApiWithSessionService"
import { SessionService } from "~/services/session/SessionService"

export interface AudioUploaderApiService {
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

export class BaseAudioUploaderService extends AbstractApiWithSessionService implements AudioUploaderApiService {
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

export function createAudioUploaderApiService(
  audioUploaderUrl: string,
  sessionService: SessionService,
): AudioUploaderApiService {
  return new BaseAudioUploaderService(audioUploaderUrl, sessionService)
}
