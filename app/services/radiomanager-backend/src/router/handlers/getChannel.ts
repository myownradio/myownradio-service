import { decodeId, encodeId } from "@myownradio/common/ids"
import { RadioChannelResource } from "@myownradio/domain/resources"
import * as knex from "knex"
import { Config } from "../../config"
import { TypedContext } from "../../interfaces"

export default function getChannel(_: Config, knexConnection: knex) {
  return async (ctx: TypedContext<RadioChannelResource>): Promise<void> => {
    const { channelId: hashedChannelId } = ctx.params
    const channelId = decodeId(hashedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const userId = ctx.state.user.uid
    const channel = await knexConnection
      .from("radio_channels")
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    ctx.body = {
      id: encodeId(channel.id),
      title: channel.title,
    }
  }
}
