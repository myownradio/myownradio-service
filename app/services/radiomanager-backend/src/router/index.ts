import * as knex from "knex";
import * as bodyparser from "koa-bodyparser";
import * as jwtMiddleware from "koa-jwt";
import * as Router from "koa-router";

import { Config } from "../config";
import createChannel from "./handlers/createChannel";

export function createRouter(config: Config, knexConnection: knex): Router {
  const router = new Router();

  router.get("/healthcheck", ctx => (ctx.status = 200));

  router.post(
    "/channels/create",
    bodyparser(),
    jwtMiddleware({
      secret: config.tokenSecret,
    }),
    createChannel(config, knexConnection),
  );

  return router;
}
