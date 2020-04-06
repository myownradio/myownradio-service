import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";
import { SessionService } from "~/services/sessionService";

export type IAudioFileMetadata = {
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
};

export type ISuccessfulUploadResponse = {
  signature: string;
  metadata: IAudioFileMetadata;
  rawMetadata: string;
};

export class AudioUploaderService extends AbstractApiWithSessionService {
  constructor(audioUploaderUrl: string, sessionService: SessionService) {
    super(audioUploaderUrl, sessionService);
  }

  public async uploadAudioFile(source: File): Promise<ISuccessfulUploadResponse> {
    const formData = new FormData();
    formData.append("source", source);

    const {
      headers: { signature },
      body: { metadata, rawMetadata },
    } = await this.makeRequestWithRefresh<{
      rawMetadata: string;
      metadata: IAudioFileMetadata;
    }>("upload", {
      method: "post",
      data: formData,
      transformResponse: data => ({
        rawMetadata: data,
        metadata: JSON.parse(data),
      }),
    });

    return { signature, metadata, rawMetadata };
  }
}
