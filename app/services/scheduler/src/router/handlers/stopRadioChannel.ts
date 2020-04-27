import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"

export default function stopRadioChannel(_: Config, knexConnection: knex, __: Logger): Middleware {
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

    const deletedRows = await knexConnection("playing_channels")
      .where({ channel_id: channelId })
      .delete()
      .count()

    if (+deletedRows === 0) {
      ctx.throw(409)
    }

    ctx.status = 200
  }
}
