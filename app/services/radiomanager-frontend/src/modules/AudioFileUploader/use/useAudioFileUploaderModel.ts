import { useContext } from "react"
import { AudioFileUploaderModel, AudioFileUploaderModelContext } from "~/modules/AudioFileUploader"

export function useAudioFileUploaderModel(): AudioFileUploaderModel {
  const probablyAudioFileUploader = useContext(AudioFileUploaderModelContext)

  if (probablyAudioFileUploader === null) {
    throw new TypeError("You probably forgot to put <AudioFileUploaderModelContext.Provider> into your application")
  }

  return probablyAudioFileUploader
}
