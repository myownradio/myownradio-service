import { IRadioChannelsEntity } from "@myownradio/entities/db"
import * as knex from "knex"
import { Context } from "koa"

export async function assertOwnChannel(
  ctx: Context,
  knexConnection: knex,
  userId: number,
  channelId: number,
): Promise<IRadioChannelsEntity> {
  const channel = await knexConnection<IRadioChannelsEntity>("radio_channels")
    .where({ id: channelId })
    .first()

  if (!channel) {
    ctx.throw(404)
  }

  if (channel.user_id !== userId) {
    ctx.throw(401)
  }

  return channel
}
