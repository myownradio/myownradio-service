import { PassThrough, Readable } from "stream"
import ffmpegPath = require("ffmpeg-static")
import ffmpeg = require("fluent-ffmpeg")
import { inject, injectable } from "inversify"
import { Logger } from "winston"
import { LoggerType } from "../di/types"

export const DECODER_CHANNELS = 2
export const DECODER_FREQUENCY = 44100
export const DECODER_FORMAT = "s16le"
export const DECODER_CODEC = "pcm_s16le"
const DECODER_WHITELISTED_PROTOCOLS = "https,tls,file,tcp,crypto"

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

export interface AudioDecoderOptions {
  readonly dJingleFileUrl?: string
  readonly nativeFramerate?: boolean
}

export abstract class AudioDecoder {
  public abstract decode(url: string, offset: number, options?: AudioDecoderOptions): Readable
}

@injectable()
export class AudioDecoderImpl implements AudioDecoder {
  constructor(@inject(LoggerType) private logger: Logger) {}

  public decode(url: string, offset: number, options: AudioDecoderOptions = {}): Readable {
    const passThrough = new PassThrough()
    const start = Date.now()

    this.logger.debug("Starting decoder", { url, offset, options })

    const logger = this.logger.child({ label: "decoder" })

    const decoder = ffmpeg(url, { logger })
      .setFfmpegPath(ffmpegPath)
      .addInputOption([`-protocol_whitelist ${DECODER_WHITELISTED_PROTOCOLS}`])
      .seekInput(millisToSeconds(offset))
      .addOption(["-fflags fastseek"])
      .audioCodec(DECODER_CODEC)
      .audioChannels(DECODER_CHANNELS)
      .audioFrequency(DECODER_FREQUENCY)
      .outputFormat(DECODER_FORMAT)

    if (options.nativeFramerate ?? true) {
      this.logger.debug("Enabled native framerate")
      decoder.native()
    }

    if (options.dJingleFileUrl) {
      decoder.input(options.dJingleFileUrl).complexFilter(JINGLE_FILTER, [])
    } else {
      decoder.audioFilter(FADEIN_FILTER)
    }

    decoder.on("error", reason => {
      this.logger.error("Decoder failed", { reason })
      decoder.kill(KILL_SIGNAL)
    })

    decoder.on("start", cmd => {
      this.logger.debug("Decoder started", { cmd })
    })

    decoder.on("end", () => {
      this.logger.debug("Decoding finished")
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
