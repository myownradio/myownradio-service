import { Readable } from "stream"
import { inject, injectable } from "inversify"
import { Logger } from "winston"
import { LoggerType } from "../di/types"
import { repeat, RepeatOptions } from "../stream"
import { AudioDecoder } from "./AudioDecoder"
import { RadioManagerClient } from "./RadioManagerClient"

export type ChannelPlayerOptions = RepeatOptions

export abstract class ChannelPlayer {
  public abstract play(channelId: number, options?: ChannelPlayerOptions): Readable
}

@injectable()
export class ChannelPlayerImpl implements ChannelPlayer {
  constructor(
    private radiomanagerClient: RadioManagerClient,
    private audioDecoder: AudioDecoder,
    @inject(LoggerType) private logger: Logger,
  ) {}

  public play(channelId: number, { repeatTimes }: ChannelPlayerOptions = {}): Readable {
    this.logger.debug("Start Channel", { channelId })

    return repeat(
      async () => {
        this.logger.debug("Get Now Playing", { channelId })

        const nowPlaying = await this.radiomanagerClient.getNowPlaying(channelId)
        this.logger.debug("Now Playing", { nowPlaying })

        this.logger.debug("Start Decoder")
        return this.audioDecoder.decode(nowPlaying.current.url, nowPlaying.current.offset, { nativeFramerate: false })
      },
      { repeatTimes },
    )
  }
}
