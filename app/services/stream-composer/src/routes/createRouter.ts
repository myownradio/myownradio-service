import { hashUtils } from "@myownradio/shared-server"
import { Container } from "inversify"
import { Context } from "koa"
import * as Router from "koa-router"
import { Logger } from "winston"
import { LoggerType } from "../di/types"
import { DECODER_CHANNELS, DECODER_FREQUENCY, DECODER_FORMAT, DECODER_CODEC } from "../services/AudioDecoder"
import { ChannelPlayer } from "../services/ChannelPlayer"
import { ChannelNotFoundError, RadioManagerClient } from "../services/RadioManagerClient"

export function createRouter(container: Container): Router {
  const router = new Router()

  const channelPlayer = container.get(ChannelPlayer)
  const radioManagerClient = container.get(RadioManagerClient)
  const logger = container.get<Logger>(LoggerType)

  router.get("/listen/:channelId", async (ctx: Context) => {
    const channelId = hashUtils.decodeId(ctx.params.channelId)

    if (!channelId) {
      return
    }

    try {
      await radioManagerClient.getNowPlaying(channelId)
    } catch (error) {
      if (error instanceof ChannelNotFoundError) {
        ctx.throw(404)
      }

      logger.error("Error occurred during fetching what is playing on the channel", { reason: error })
      ctx.throw(503)
    }

    ctx.set("pcm-frequency", String(DECODER_FREQUENCY))
    ctx.set("pcm-channels", String(DECODER_CHANNELS))
    ctx.set("pcm-format", DECODER_FORMAT)
    ctx.set("pcm-codec", DECODER_CODEC)

    ctx.set("content-type", `audio/pcm`)

    ctx.body = channelPlayer.play(channelId)
  })

  return router
}
