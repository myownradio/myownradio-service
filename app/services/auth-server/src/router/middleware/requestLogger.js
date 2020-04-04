/**
 * @see https://github.com/koajs/koa/blob/d48d88ee17b780c02123e6d657274cab456e943e/lib/context.js#L150
 */
const DEFAULT_KOAJS_ERROR_STATUS_CODE = 500;

module.exports = function requestLogger(logger) {
  return async (ctx, next) => {
    try {
      await next();
      logger.warn("a");
    } catch (error) {
      logger.warn("b");
      const route = ctx._matchedRoute;
      const { method } = ctx.request;

      const statusCode = error.status || DEFAULT_KOAJS_ERROR_STATUS_CODE;
      const errorText = error.stack || error;

      logger.warn(`Error happened during inbound http request: ${errorText}`, { method, route, statusCode });

      throw error;
    }
  };
};
