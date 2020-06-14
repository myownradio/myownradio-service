import { dateUtils, hashUtils, entities } from "@myownradio/shared-server"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { TimeService } from "../../time"

export default function pauseRadioChannel(
  _: Config,
  knexConnection: knex,
  __: Logger,
  timeService: TimeService,
): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const channel = await knexConnection<entities.IRadioChannelsEntity>("radio_channels")
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const now = timeService.now()
    const updatedRows = await knexConnection<entities.IPlayingChannelsEntity>("playing_channels")
      .where({
        channel_id: channel.id,
        paused_at: null,
      })
      .update({
        updated_at: dateUtils.convertDateToIso(now),
        paused_at: dateUtils.convertDateToIso(now),
      })
      .count()

    if (+updatedRows === 0) {
      ctx.throw(409)
    }

    ctx.status = 200
  }
}
