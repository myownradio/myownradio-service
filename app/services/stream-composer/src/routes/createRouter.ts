import { hashUtils } from "@myownradio/shared-server"
import { Container } from "inversify"
import { Context } from "koa"
import * as Router from "koa-router"
import { DECODER_CHANNELS, DECODER_FREQUENCY, DECODER_FORMAT, DECODER_CODEC } from "../services/AudioDecoder"
import { ChannelPlayer } from "../services/ChannelPlayer"

export function createRouter(container: Container): Router {
  const router = new Router()

  const channelPlayer = container.get(ChannelPlayer)

  router.get("/listen/:channelId", async (ctx: Context) => {
    const channelId = hashUtils.decodeId(ctx.params.channelId)

    if (!channelId) {
      return
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
