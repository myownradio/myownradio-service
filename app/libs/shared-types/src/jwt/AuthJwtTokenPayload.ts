type AudioFormat = "mp3_64k" | "mp3_128k" | "mp3_256k" | "mp3_320k"

export interface AuthJwtTokenPayload {
  audioFormats: AudioFormat[]
  limits: {
    maxChannels: number
    maxAudioFiles: number
  }
}
