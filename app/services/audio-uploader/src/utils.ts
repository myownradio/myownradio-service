import { path as ffprobePath } from "ffprobe-static"
import * as fluent from "fluent-ffmpeg"

const MILLIS_IN_SECOND = 1000

export interface MediaFileMetadata {
  duration: number
  bitrate: number
  format: string
  artist?: string
  title?: string
  album?: string
  genre?: string
}

export function getMediaFileMetadata(filepath): Promise<MediaFileMetadata> {
  return new Promise((resolve, reject) => {
    fluent(filepath)
      .setFfprobePath(ffprobePath)
      .ffprobe((err, metadata) => {
        if (err) {
          reject(err)
        } else {
          const tags = (metadata.format.tags ?? {}) as {
            readonly artist?: string
            readonly title?: string
            readonly album?: string
            readonly genre?: string
          }

          resolve({
            duration: metadata.format.duration * MILLIS_IN_SECOND,
            bitrate: metadata.format.bit_rate,
            format: metadata.format.format_long_name ?? "Unknown audio format",
            artist: tags.artist ?? "",
            title: tags.title ?? "",
            album: tags.album ?? "",
            genre: tags.genre ?? "",
          })
        }
      })
  })
}
