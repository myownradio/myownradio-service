import * as knex from "knex";
import { Context, Middleware } from "koa";
import { Logger } from "winston";
import { Config } from "../../config";

export default function startRadioChannel(_: Config, knexConnection: knex, logger: Logger): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid;

    const { channelId } = ctx.params;

    const channel = await knexConnection("radio_channels")
      .where({ id: channelId })
      .first();

    if (!channel) {
      ctx.throw(404);
    }

    if (channel.user_id !== userId) {
      ctx.throw(401);
    }

    ctx.status = 501;
  };
}
