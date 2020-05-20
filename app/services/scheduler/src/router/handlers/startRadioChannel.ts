import { decodeId } from "@myownradio/common/ids"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { TimeService } from "../../time"
import { assertOwnChannel } from "./utils/assertOwnChannel"

export default function startRadioChannel(
  _: Config,
  knexConnection: knex,
  __: Logger,
  timeService: TimeService,
): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channel = await assertOwnChannel(ctx, knexConnection, userId, decodeId(encodedChannelId))

    try {
      const now = timeService.now()
      await knexConnection("playing_channels").insert({
        channel_id: channel.id,
        start_offset: 0,
        started_at: now,
        paused_at: null,
      })
      ctx.status = 200
    } catch (e) {
      if (e.message.match(/constraint/)) {
        ctx.status = 409
      } else {
        throw e
      }
    }
  }
}
