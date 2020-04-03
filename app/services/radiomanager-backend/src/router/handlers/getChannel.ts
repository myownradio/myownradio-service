import * as knex from "knex";
import { Context } from "koa";
import { Config } from "../../config";

export default function getChannel(_: Config, knexConnection: knex) {
  return async (ctx: Context): Promise<void> => {
    const { channelId } = ctx.params;
    const userId = ctx.state.user.uid;
    const channel = await knexConnection
      .from("radio_channels")
      .where({ id: channelId })
      .first();

    if (!channel) {
      ctx.throw(404);
    }

    if (channel.user_id !== userId) {
      ctx.throw(401);
    }

    ctx.body = {
      id: channel.id,
      title: channel.title,
    };
  };
}
