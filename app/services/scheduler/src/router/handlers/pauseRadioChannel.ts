import { decodeId, encodeId } from "@myownradio/common/ids"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { TimeService } from "../../time"
import { assertOwnChannel } from "./utils/assertOwnChannel"

export default function pauseRadioChannel(
  _: Config,
  knexConnection: knex,
  __: Logger,
  timeService: TimeService,
): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channel = await assertOwnChannel(ctx, knexConnection, userId, decodeId(encodedChannelId))

    const now = timeService.now()
    const updatedRows = await knexConnection("playing_channels")
      .where({
        channel_id: channel.id,
        paused_at: null,
      })
      .update({
        paused_at: now,
      })
      .count()

    if (+updatedRows === 0) {
      ctx.throw(409)
    }

    ctx.status = 200
  }
}
