import { hashUtils } from "@myownradio/shared-server"
import { Container } from "inversify"
import { Context } from "koa"
import * as Router from "koa-router"
import { DECODER_CHANNELS, DECODER_CODEC, DECODER_FREQUENCY, DECODER_FORMAT } from "../services/AudioDecoder"
import { ChannelPlayer } from "../services/ChannelPlayer"

export function createRouter(container: Container): Router {
  const router = new Router()

  const channelPlayer = container.get(ChannelPlayer)

  router.get("/listen/:channelId", async (ctx: Context) => {
    const channelId = hashUtils.decodeId(ctx.params.channelId)

    if (!channelId) {
      return
    }

    ctx.set("audio-channels", String(DECODER_CHANNELS))
    ctx.set("audio-frequency", String(DECODER_FREQUENCY))
    ctx.set("audio-codec", DECODER_CODEC)
    ctx.set("audio-format", DECODER_FORMAT)

    ctx.body = channelPlayer.play(channelId)
  })

  return router
}
