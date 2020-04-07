import * as PropTypes from "prop-types";
import * as React from "react";
import { useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useDependencies } from "~/bootstrap/dependencies";
import useFileSelect from "~/components/use/useFileSelect";
import { SUPPORTED_AUDIO_EXTENSIONS } from "~/constants";
import { IAudioTrack } from "~/services/RadioManagerService";
import { getLocalizedErrorKey } from "~/utils/error";
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
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [failedUploads, setFailedUploads] = useState<FailedUploadState[]>([]);
  const { audioUploaderService } = useDependencies();

  const handleUploadClick = useFileSelect(SUPPORTED_AUDIO_EXTENSIONS, selectedFiles => {
    setFileQueue(files => [...files, ...selectedFiles]);
  });

  const file = fileQueue[0];

  const handleUploadSuccess = useCallback<(audioTrack: IAudioTrack) => void>(
    audioTrack => {
      setFileQueue(files => files.slice(1));
      onUploadSuccess(audioTrack);
    },
    [setFileQueue, onUploadSuccess],
  );

  const handleUploadFailure = useCallback(
    error => {
      if (audioUploaderService.isCancelledRequest(error)) {
        setFileQueue([]);
      } else {
        setFailedUploads(failedUploads => [...failedUploads, { file, error }]);
        setFileQueue(files => files.slice(1));
      }
    },
    [file, audioUploaderService],
  );

  return (
    <>
      {file ? <UploadSingleFile channelId={channelId} file={file} onSuccess={handleUploadSuccess} onFailure={handleUploadFailure} /> : <button onClick={handleUploadClick}>Upload</button>}
      {failedUploads.length > 0 && (
        <>
          <h2>Failed uploads</h2>
          <ul>
            {failedUploads.map(({ file, error }) => (
              <li key={file.name}>
                {file.name}: <FormattedMessage id={getLocalizedErrorKey(error)} />
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
