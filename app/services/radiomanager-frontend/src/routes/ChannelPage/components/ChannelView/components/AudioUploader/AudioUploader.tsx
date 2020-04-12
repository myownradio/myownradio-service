import * as PropTypes from "prop-types";
import * as React from "react";
import { useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useDependencies } from "~/bootstrap/dependencies";
import useFileSelect from "~/components/use/useFileSelect";
import { SUPPORTED_AUDIO_EXTENSIONS } from "~/constants";
import { IAudioTrack } from "~/services/RadioManagerService";
import { getLocaleErrorKey } from "~/utils/error";
import UploadSingleFile from "./components/UploadSingleFile";

interface AudioUploaderProps {
  channelId: number;
  onUploadSuccess: (audioTrack: IAudioTrack) => void;
}

interface FailedUploadState {
  file: File;
  error: Error;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ channelId, onUploadSuccess }) => {
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [failedUploads, setFailedUploads] = useState<FailedUploadState[]>([]);
  const { audioUploaderService, loggerService } = useDependencies();

  const handleUploadClick = useFileSelect(SUPPORTED_AUDIO_EXTENSIONS, selectedFiles => {
    setUploadQueue(files => [...files, ...selectedFiles]);
  });

  const handleUploadSuccess = useCallback<(audioTrack: IAudioTrack) => void>(
    audioTrack => {
      setUploadQueue(files => files.slice(1));
      onUploadSuccess(audioTrack);
    },
    [setUploadQueue, onUploadSuccess],
  );

  const handleUploadFailure = useCallback(
    (error, file) => {
      if (audioUploaderService.isCancelledRequest(error)) {
        loggerService.error("Upload cancelled by user request");
        setUploadQueue([]);
        return;
      }

      loggerService.error("Error occurred on audio file upload", { error, file });
      const failedUpload = { error, file };
      setFailedUploads(failedUploads => [...failedUploads, failedUpload]);
      setUploadQueue(files => files.slice(1));
    },
    [audioUploaderService, loggerService],
  );

  return (
    <>
      {uploadQueue.length > 0 ? (
        <UploadSingleFile
          channelId={channelId}
          file={uploadQueue[0]}
          onSuccess={handleUploadSuccess}
          onFailure={handleUploadFailure}
        />
      ) : (
        <button onClick={handleUploadClick}>Upload</button>
      )}
      {failedUploads.length > 0 && (
        <>
          <h2>Failed uploads</h2>
          <ul>
            {failedUploads.map(({ file, error }) => (
              <li key={file.name}>
                {file.name}: <FormattedMessage id={getLocaleErrorKey(error)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

AudioUploader.propTypes = {
  channelId: PropTypes.number.isRequired,
  onUploadSuccess: PropTypes.func.isRequired,
};

export default AudioUploader;
