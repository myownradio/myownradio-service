import { Context, Middleware } from "koa";

export default function startRadioChannel(): Middleware {
  return async (ctx: Context): Promise<void> => {
    ctx.status = 501;
  };
}
