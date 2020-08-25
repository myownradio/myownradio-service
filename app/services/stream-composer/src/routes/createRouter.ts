import { hashUtils } from "@myownradio/shared-server"
import { Container } from "inversify"
import { Context } from "koa"
import * as Router from "koa-router"
import { ChannelPlayer } from "../services/ChannelPlayer"

export function createRouter(container: Container): Router {
  const router = new Router()

  const channelPlayer = container.get(ChannelPlayer)

  router.get("/channel/:channelId", async (ctx: Context) => {
    const channelId = hashUtils.decodeId(ctx.params.channelId)

    if (!channelId) {
      return
    }

    ctx.body = channelPlayer.play(channelId)
  })

  return router
}
