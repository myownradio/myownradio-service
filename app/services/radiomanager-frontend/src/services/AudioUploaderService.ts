import { CancelToken } from "axios";
import { SessionService } from "~/services/SessionService";
import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";

export interface AudioUploaderService {
  uploadAudioFile(source: File): Promise<SuccessfulUploadResponse>;
  uploadAudioFile(source: File, options: UploadAudioOptions): Promise<SuccessfulUploadResponse>;
}

export interface AudioFileMetadata {
  hash: string;
  size: number;
  name: string;
  duration: number;
  bitrate: number;
  format: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
}

export interface SuccessfulUploadResponse {
  signature: string;
  metadata: AudioFileMetadata;
  rawMetadata: string;
}

export interface UploadAudioOptions {
  cancelToken?: CancelToken;
  onProgress?: (loaded: number, total: number) => void;
}

export class BaseAudioUploaderService extends AbstractApiWithSessionService implements AudioUploaderService {
  constructor(audioUploaderUrl: string, sessionService: SessionService) {
    super(audioUploaderUrl, sessionService);
  }

  public async uploadAudioFile(source: File, options: UploadAudioOptions = {}): Promise<SuccessfulUploadResponse> {
    const formData = new FormData();
    formData.append("source", source);

    const {
      headers: { signature },
      body: { metadata, rawMetadata },
    } = await this.makeRequestWithRefresh<{
      rawMetadata: string;
      metadata: AudioFileMetadata;
    }>("upload", {
      method: "post",
      data: formData,
      transformResponse: data => ({
        rawMetadata: data,
        metadata: JSON.parse(data),
      }),
      cancelToken: options.cancelToken,
      onUploadProgress(progressEvent: ProgressEvent) {
        options.onProgress && options.onProgress(progressEvent.loaded, progressEvent.total);
      },
    });

    return { signature, metadata, rawMetadata };
  }
}

export function createAudioUploaderService(
  audioUploaderUrl: string,
  sessionService: SessionService,
): AudioUploaderService {
  return new BaseAudioUploaderService(audioUploaderUrl, sessionService);
}
