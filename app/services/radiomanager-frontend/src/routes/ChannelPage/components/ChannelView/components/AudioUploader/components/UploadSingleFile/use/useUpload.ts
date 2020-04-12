import { CancelTokenSource } from "axios";
import { useEffect, useState } from "react";
import { useDependencies } from "~/bootstrap/dependencies";
import { AudioTrack } from "~/services/RadioManagerService";

export default function useUpload(
  channelId: number,
  file: File,
  cancelTokenSource: CancelTokenSource,
  onSuccess: (audioTrack: AudioTrack) => void,
  onFailure: (error: Error, file: File) => void,
): [number] {
  const [progress, setProgress] = useState<number>(0);
  const { audioUploaderService, radioManagerService, loggerService } = useDependencies();

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        loggerService.info("Uploading audio file", { channelId, file });
        const { signature, rawMetadata } = await audioUploaderService.uploadAudioFile(file, {
          cancelToken: cancelTokenSource.token,
          onProgress(loaded, total) {
            setProgress((100 / total) * loaded);
          },
        });

        loggerService.info("Adding uploaded audio file to channel", { channelId, rawMetadata });
        const audioTrack = await radioManagerService.addTrackToChannel(channelId, signature, rawMetadata);

        loggerService.info("Upload successful", { channelId, audioTrack });
        onSuccess(audioTrack);
      } catch (error) {
        onFailure(error, file);
      }
    })();
  }, [
    channelId,
    file,
    loggerService,
    onFailure,
    onSuccess,
    radioManagerService,
    audioUploaderService,
    cancelTokenSource,
  ]);

  return [progress];
}
