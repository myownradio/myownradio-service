import { RadioChannelResource } from "@myownradio/shared-types"
import * as knex from "knex"
import { Config } from "../../config"
import { TypedContext } from "../../interfaces"
import { hashUtils } from '@myownradio/shared-server'

const { encodeId } = hashUtils

export default function getChannels(_: Config, knexConnection: knex) {
  return async (ctx: TypedContext<RadioChannelResource[]>): Promise<void> => {
    const userId = ctx.state.user.uid
    const channels = await knexConnection.from("radio_channels").where({ user_id: userId })

    ctx.body = channels.map(channel => ({
      id: encodeId(channel.id),
      title: channel.title,
    }))
  }
}
