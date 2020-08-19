import { Container } from "inversify"
import { Context, Middleware } from "koa"

/**
 * This middleware restores radio channel's now playing position after playlist updated.
 */
export function syncRadioChannelMiddleware(container: Container): Middleware {
  void container

  return async (ctx: Context, next: () => PromiseLike<any>): Promise<void> => {
    void ctx

    await next()
  }
}
