import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { TimeService } from "../../time"

export default function startRadioChannel(
  _: Config,
  knexConnection: knex,
  __: Logger,
  timeService: TimeService,
): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid

    const { channelId } = ctx.params

    const channel = await knexConnection("radio_channels")
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    try {
      const now = timeService.now()
      await knexConnection("playing_channels").insert({
        channel_id: channelId,
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
