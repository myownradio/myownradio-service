import { Context, Middleware } from "koa";
import { Logger } from "winston";

/**
 * @see https://github.com/koajs/koa/blob/d48d88ee17b780c02123e6d657274cab456e943e/lib/context.js#L150
 */
const DEFAULT_KOAJS_ERROR_STATUS_CODE = 500;

export default function requestLogger(logger: Logger): Middleware {
  return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    try {
      await next();
    } catch (error) {
      const route = ctx._matchedRoute;
      const { method } = ctx.request;

      const statusCode = error.status || DEFAULT_KOAJS_ERROR_STATUS_CODE;
      const errorText = (error.stack || error) as string;

      logger.warn(`Error happened during inbound http request: ${errorText}`, { method, route, statusCode });

      throw error;
    }
  };
}