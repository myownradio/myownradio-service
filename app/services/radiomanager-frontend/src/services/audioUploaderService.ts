import { AbstractApiWithSessionService } from "~/services/abstractApiWithSessionService";
import { SessionService } from "~/services/sessionService";

export type IAudioFileMetadata = {};

export type ISuccessfulUploadResponse = {
  signature: string;
  metadata: IAudioFileMetadata;
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
      body: metadata,
    } = await this.makeRequestWithRefresh<IAudioFileMetadata>("upload", {
      method: "post",
      data: formData,
    });

    return { signature, metadata };
  }
}
