import { decodeId } from "@myownradio/common/ids"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { TimeService } from "../../time"
import { assertOwnChannel } from "./utils/assertOwnChannel"

export default function resumeRadioChannel(
  _: Config,
  knexConnection: knex,
  __: Logger,
  timeService: TimeService,
): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channel = await assertOwnChannel(ctx, knexConnection, userId, decodeId(encodedChannelId))

    await knexConnection.transaction(async trx => {
      const playingChannel = await trx("playing_channels")
        .where({ channel_id: channel.id })
        .first()

      if (!playingChannel || playingChannel.paused_at === null) {
        ctx.throw(409)
      }

      const now = timeService.now()

      const updatedRows = await trx("playing_channels")
        .where({
          id: playingChannel.id,
        })
        .update({
          started_at: playingChannel.started_at + (now - playingChannel.paused_at),
          paused_at: null,
        })
        .count()

      if (+updatedRows === 0) {
        // This should never happen
        ctx.throw(409)
      }
    })

    ctx.status = 200
  }
}
