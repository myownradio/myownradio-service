export interface AudioPlayerState {
  status: "initial" | "audio_unsupported" | "media_error" | "loading" | "playing" | "stopped"
  currentTime: number
}

export const initialAudioPlayerState: AudioPlayerState = {
  status: "initial",
  currentTime: 0,
}
