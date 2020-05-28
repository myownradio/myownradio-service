import { toIso, toMillis } from "@mor/common/date"
import { decodeId } from "@mor/common/ids"
import { IPlayingChannelsEntity, IRadioChannelsEntity } from "@myownradio/entities/db"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { TimeService } from "../../time"

export default function resumeRadioChannel(
  _: Config,
  knexConnection: knex,
  __: Logger,
  timeService: TimeService,
): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channelId = decodeId(encodedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const channel = await knexConnection<IRadioChannelsEntity>("radio_channels")
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    await knexConnection.transaction(async trx => {
      const playingChannel = await trx<IPlayingChannelsEntity>("playing_channels")
        .where({ channel_id: channel.id })
        .first()

      if (!playingChannel || playingChannel.paused_at === null) {
        ctx.throw(409)
      }

      const now = timeService.now()

      const updatedRows = await trx<IPlayingChannelsEntity>("playing_channels")
        .where({
          id: playingChannel.id,
        })
        .update({
          started_at: toIso(toMillis(playingChannel.started_at) + (now - toMillis(playingChannel.paused_at))),
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
