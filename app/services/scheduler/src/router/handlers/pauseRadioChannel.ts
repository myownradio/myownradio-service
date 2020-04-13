import { Context, Middleware } from "koa";

export default function pauseRadioChannel(): Middleware {
  return async (ctx: Context): Promise<void> => {
    ctx.status = 501;
  };
}
