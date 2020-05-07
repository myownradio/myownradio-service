import axios from "axios"
import { CancelTokenSource } from "axios"
import * as PropTypes from "prop-types"
import * as React from "react"
import { useCallback, useMemo } from "react"
import { RadioManagerAudioTrack } from "~/services/api/RadioManagerApiService"
import useUpload from "./use/useUpload"

const CancelToken = axios.CancelToken

interface UploadSingleFileProps {
  channelId: number
  file: File
  onSuccess: (audioTrack: RadioManagerAudioTrack) => void
  onFailure: (error: Error, file: File) => void
}

const UploadSingleFile: React.FC<UploadSingleFileProps> = ({ channelId, file, onSuccess, onFailure }) => {
  const cancelTokenSource = useMemo<CancelTokenSource>(() => CancelToken.source(), [])
  const [progress] = useUpload(channelId, file, cancelTokenSource, onSuccess, onFailure)

  const handleAbortClicked = useCallback(() => {
    cancelTokenSource.cancel("Cancelled by User")
  }, [cancelTokenSource])

  return (
    <>
      Uploading {file.name} {progress.toFixed(1)}%...
      <button onClick={handleAbortClicked}>Abort</button>
    </>
  )
}

UploadSingleFile.propTypes = {
  channelId: PropTypes.number.isRequired,
  file: PropTypes.instanceOf(File).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
}

export default UploadSingleFile
