import { Context } from "koa"

export interface TypedContext<TBody = unknown> extends Context {
  body: TBody
}
