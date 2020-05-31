import { Context } from "koa"

export interface StrictlyTypedContext<ResBody extends {}> extends Context {
  body: ResBody
}

export interface StrictlyTypedRouteHandler<ResBody extends {}> {
  (ctx: StrictlyTypedContext<ResBody>): Promise<void>
}
