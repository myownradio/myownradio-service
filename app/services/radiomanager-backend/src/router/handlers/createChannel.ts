import { encodeId } from "@myownradio/common/ids"
import { RadioChannelResource } from "@myownradio/domain/resources"
import * as t from "io-ts"
import * as knex from "knex"
import { Config } from "../../config"
import { TypedContext } from "../../interfaces"

const CreateChannelRequestContract = t.type({
  title: t.string,
})

export default function createChannel(_: Config, knexConnection: knex) {
  return async (ctx: TypedContext<RadioChannelResource>): Promise<void> => {
    const userId = ctx.state.user.uid

    const decodedResult = CreateChannelRequestContract.decode(ctx.request.body)

    if (decodedResult._tag === "Left") {
      ctx.throw(400)
    }

    const requestBody = decodedResult.right

    try {
      const [channelId] = await knexConnection
        .into("radio_channels")
        .insert({
          title: requestBody.title,
          user_id: userId,
        })
        .returning("id")

      ctx.body = {
        id: encodeId(channelId),
        title: requestBody.title,
      }
    } catch (e) {
      if (e.message.match(/constraint/)) {
        ctx.status = 401
      } else {
        throw e
      }
    }
  }
}
