import * as PropTypes from "prop-types";
import * as React from "react";
import { useState, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { useDependencies } from "~/bootstrap/dependencies";
import { SUPPORTED_AUDIO_EXTENSIONS } from "~/constants";
import { IAudioTrack } from "~/services/RadioManagerService";
import { getLocalizedErrorKey } from "~/utils/error";
import UploadSingleFile from "./components/UploadSingleFile";

interface AudioUploaderProps {
  channelId: number;
  onUploadSuccess: (audioTrack: IAudioTrack) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ channelId, onUploadSuccess }) => {
  const [fileQueue, setFileQueue] = useState<File[]>([]);
  const [failedUploads, setFailedUploads] = useState<Array<{ file: File; error: Error }>>([]);

  const { audioUploaderService } = useDependencies();

  const file = fileQueue[0];

  const handleUploadClick = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("multiple", "1");
    input.setAttribute("type", "file");
    input.setAttribute("accept", SUPPORTED_AUDIO_EXTENSIONS);
    input.addEventListener("change", async (event: Event) => {
      if (event.target) {
        const eventTarget = event.target as HTMLInputElement;
        if (eventTarget.files) {
          const newFiles = Array.from(eventTarget.files);
          setFileQueue(files => [...files, ...newFiles]);
        }
      }
    });
    input.click();
  }, [setFileQueue]);

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
                {file.name}: <FormattedMessage key={getLocalizedErrorKey(error)} />
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
