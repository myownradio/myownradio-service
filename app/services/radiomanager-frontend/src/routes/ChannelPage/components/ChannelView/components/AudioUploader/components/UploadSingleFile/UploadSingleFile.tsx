import axios from "axios";
import { CancelTokenSource } from "axios";
import * as PropTypes from "prop-types";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDependencies } from "~/bootstrap/dependencies";
import { IAudioTrack } from "~/services/RadioManagerService";

const CancelToken = axios.CancelToken;

interface UploadSingleFileProps {
  channelId: number;
  file: File;
  onSuccess: (audioTrack: IAudioTrack) => void;
  onFailure: (error: Error) => void;
}

const UploadSingleFile: React.FC<UploadSingleFileProps> = ({ channelId, file, onSuccess, onFailure }) => {
  const [progress, setProgress] = useState<number>(0);

  const cancelTokenSource = useMemo<CancelTokenSource>(() => CancelToken.source(), []);
  const { audioUploaderService, radioManagerService } = useDependencies();

  const handleAbortClicked = useCallback(() => {
    cancelTokenSource.cancel("Cancelled by User");
  }, [cancelTokenSource]);

  useEffect(() => {
    Promise.resolve()
      .then(() => {
        return audioUploaderService.uploadAudioFile(file, {
          cancelToken: cancelTokenSource.token,
          onProgress(loaded, total) {
            setProgress((100 / total) * loaded);
          },
        });
      })
      .then(({ signature, rawMetadata }) => {
        return radioManagerService.addTrackToChannel(channelId, signature, rawMetadata);
      })
      .then(audioTrack => {
        onSuccess(audioTrack);
      })
      .catch(onFailure);
  }, [channelId, cancelTokenSource, file, onSuccess, onFailure, radioManagerService, audioUploaderService]);

  return (
    <>
      Uploading {file.name} {progress.toFixed(1)}%...
      <button onClick={handleAbortClicked}>Abort</button>
    </>
  );
};

UploadSingleFile.propTypes = {
  channelId: PropTypes.number.isRequired,
  file: PropTypes.instanceOf(File).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

export default UploadSingleFile;
