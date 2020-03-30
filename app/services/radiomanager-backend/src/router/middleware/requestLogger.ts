import { Context, Middleware } from "koa";
import { Logger } from "winston";

export default function requestLogger(logger: Logger): Middleware {
  return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    try {
      await next();
    } catch (error) {
      const route = ctx._matchedRoute;
      const { method } = ctx.request;
      const responseCode = error.code || -1;
      const errorText = (error.stack || error) as string;
      logger.warn(`Error happened during inbound http request: ${errorText}`, { method, route, responseCode });
      throw error;
    }
  };
}
