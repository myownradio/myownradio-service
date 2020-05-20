import { decodeId } from "@myownradio/common/ids"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { Logger } from "winston"
import { Config } from "../../config"
import { assertOwnChannel } from "./utils/assertOwnChannel"

export default function stopRadioChannel(_: Config, knexConnection: knex, __: Logger): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channel = await assertOwnChannel(ctx, knexConnection, userId, decodeId(encodedChannelId))

    const deletedRows = await knexConnection("playing_channels")
      .where({ channel_id: channel.id })
      .delete()
      .count()

    if (+deletedRows === 0) {
      ctx.throw(409)
    }

    ctx.status = 200
  }
}
