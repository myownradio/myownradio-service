import { PassThrough, Readable } from "stream"
import ffmpegPath = require("ffmpeg-static")
import ffmpeg = require("fluent-ffmpeg")
import { injectable } from "inversify"
import { Logger } from "winston"

export const DECODER_CHANNELS = 2
export const DECODER_FREQUENCY = 44100
export const DECODER_FORMAT = "s16le"
export const DECODER_CODEC = "pcm_s16le"

export const FADEIN_FILTER = "afade=t=in:st=0:d=1"
export const JINGLE_FILTER = "[0:a]afade=t=in:st=1:d=3[a1],[a1]amix=inputs=2:duration=first:dropout_transition=3"

export const KILL_SIGNAL = "SIGKILL"

const millisToSeconds = (millis: number): number => millis / 1000

export interface DecodingProgress {
  frames: null
  currentFps: null
  currentKbps: number
  targetSize: number
  timemark: string
  percent: number
}

export abstract class AudioDecoder {
  public abstract decode(url: string, offset: number, jingleFileUrl?: string): Readable
}

@injectable()
export class AudioDecoderImpl implements AudioDecoder {
  constructor(private logger: Logger) {}

  public decode(url: string, offset: number, jingleFileUrl?: string): Readable {
    const passThrough = new PassThrough()
    const start = Date.now()

    const decoder = ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .addOption(["-fflags fastseek"])
      .audioCodec(DECODER_CODEC)
      .audioChannels(DECODER_CHANNELS)
      .audioFrequency(DECODER_FREQUENCY)
      .outputFormat(DECODER_FORMAT)
      .input(url)
      .seekInput(millisToSeconds(offset))
      .native()

    if (jingleFileUrl) {
      decoder.input(jingleFileUrl).complexFilter(JINGLE_FILTER, [])
    } else {
      decoder.audioFilter(FADEIN_FILTER)
    }

    decoder.on("error", err => {
      this.logger.error(`Decoder failed: ${err}`)
      decoder.kill(KILL_SIGNAL)
    })

    decoder.on("start", commandLine => {
      this.logger.debug(`Decoder started: ${commandLine}`)
    })

    decoder.on("end", () => {
      this.logger.debug(`Decoder finished`)
    })

    decoder.once("progress", () => {
      const real = Date.now()
      const delay = real - start
      this.logger.debug(`Decoder started with delay: ${delay}ms`)
    })

    decoder.pipe(passThrough)

    return passThrough
  }
}
