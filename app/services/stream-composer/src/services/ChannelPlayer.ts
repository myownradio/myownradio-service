import { Readable } from "stream"
import { inject, injectable } from "inversify"
import { Logger } from "winston"
import { LoggerType } from "../di/types"
import { repeat, RepeatOptions } from "../stream"
import { AudioDecoder, AudioDecoderOptions } from "./AudioDecoder"
import { RadioManagerClient } from "./RadioManagerClient"

export type ChannelPlayerOptions = RepeatOptions & AudioDecoderOptions

export abstract class ChannelPlayer {
  public abstract play(channelId: number, options?: ChannelPlayerOptions): Readable
}

@injectable()
export class ChannelPlayerImpl implements ChannelPlayer {
  constructor(
    private radiomanagerClient: RadioManagerClient,
    private audioDecoder: AudioDecoder,
    @inject(LoggerType) private logger: Logger,
  ) {
    this.logger.debug("Channel player initialized")
  }

  public play(channelId: number, { repeatTimes, nativeFramerate }: ChannelPlayerOptions = {}): Readable {
    const repeatOptions = { repeatTimes }
    this.logger.debug("Starting channel player", { channelId, repeatOptions })

    return repeat(async () => {
      this.logger.debug("Getting what's playing on the channel", { channelId })

      const nowPlaying = await this.radiomanagerClient.getNowPlaying(channelId)
      this.logger.debug("Now playing", nowPlaying)

      const decoderOptions = { nativeFramerate }
      this.logger.debug("Going to start decoder", { decoderOptions })
      return this.audioDecoder.decode(nowPlaying.current.url, nowPlaying.current.offset, decoderOptions)
    }, repeatOptions)
  }
}
