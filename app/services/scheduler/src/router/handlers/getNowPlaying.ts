import { Context, Middleware } from "koa";

export default function getNowPlaying(): Middleware {
  return async (ctx: Context): Promise<void> => {
    ctx.status = 200;
  };
}
