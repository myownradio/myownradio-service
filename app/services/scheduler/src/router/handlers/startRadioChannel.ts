import { dateUtils, hashUtils, entities } from "@myownradio/shared-server"
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

    try {
      const now = timeService.now()
      const nowDate = dateUtils.convertDateToIso(now)
      await knexConnection<entities.IPlayingChannelsEntity>("playing_channels").insert({
        channel_id: channel.id,
        start_offset: 0,
        started_at: nowDate,
        paused_at: null,
        created_at: nowDate,
        updated_at: nowDate,
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
