import * as knex from "knex";
import { Context } from "koa";
import { Config } from "../../config";

export default function getChannels(_: Config, knexConnection: knex) {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid;
    const channels = await knexConnection.from("radio_channels").where({ user_id: userId });

    ctx.body = channels.map(channel => ({
      id: channel.id,
      title: channel.title,
    }));
  };
}
