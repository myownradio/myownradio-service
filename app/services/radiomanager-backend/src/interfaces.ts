import { Context } from "koa"

export interface TypedContext<T> extends Context {
  body: T
}
