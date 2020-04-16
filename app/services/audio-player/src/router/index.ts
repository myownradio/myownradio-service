import * as KoaRouter from "koa-router";

export function createRouter(): KoaRouter {
  const router = new KoaRouter();

  router.get("/healthcheck", ctx => (ctx.status = 200));

  return router;
}
