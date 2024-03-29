import { path as ffprobePath } from "ffprobe-static"
import * as fluent from "fluent-ffmpeg"
import { FfprobeData } from "fluent-ffmpeg"

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

export async function getMediaFileMetadata(filepath: string): Promise<MediaFileMetadata> {
  const probeResult = await new Promise<FfprobeData>((resolve, reject) => {
    fluent(filepath)
      .setFfprobePath(ffprobePath)
      .ffprobe((err, metadata) => {
        err ? reject(err) : resolve(metadata)
      })
  })

  if (!probeResult.format) {
    throw new TypeError("Error occurred on read metadata - no format in probe results")
  }

  if (!probeResult.format.duration) {
    throw new TypeError("Error occurred on read metadata - no duration")
  }

  if (!probeResult.format.bit_rate) {
    throw new TypeError("Error occurred on read metadata - no bitrate")
  }

  if (!probeResult.format.format_long_name) {
    throw new TypeError("Error occurred on read metadata - unknown file format")
  }

  const tags = (probeResult.format.tags ?? {}) as {
    readonly artist?: string
    readonly title?: string
    readonly album?: string
    readonly genre?: string
  }

  return {
    duration: probeResult.format.duration * MILLIS_IN_SECOND,
    bitrate: probeResult.format.bit_rate,
    format: probeResult.format.format_long_name ?? "Unknown audio format",
    artist: tags.artist ?? "",
    title: tags.title ?? "",
    album: tags.album ?? "",
    genre: tags.genre ?? "",
  }
}
