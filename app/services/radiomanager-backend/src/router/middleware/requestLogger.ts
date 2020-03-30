import { Context, Middleware } from "koa";
import { Logger } from "winston";

export default function requestLogger(logger: Logger): Middleware {
  return async (ctx: Context, next: () => Promise<void>) => {
    const route = ctx._matchedRoute;
    const { method } = ctx.request;
    try {
      await next();
    } catch (error) {
      const responseCode = error.code || 0;
      const errorText = (error.stack || error) as string;
      logger.warn(`Error happened on inbound http request: ${errorText}`, { method, route, responseCode });
    }
  };
}
