import { Context, Middleware } from "koa";

export default function stopRadioChannel(): Middleware {
  return async (ctx: Context): Promise<void> => {
    ctx.status = 200;
  };
}
