import * as Router from "koa-router";
import { Config } from "../config";

export function createRouter(config: Config): Router {
  const router = new Router();

  router.get("/healthcheck", ctx => (ctx.status = 200));

  return router;
}
