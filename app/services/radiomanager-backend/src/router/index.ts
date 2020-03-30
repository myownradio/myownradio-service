import * as knex from "knex";
import * as bodyparser from "koa-bodyparser";
import * as createJwtMiddleware from "koa-jwt";
import * as Router from "koa-router";
import { Config } from "../config";
import addTrackToChannel from "./handlers/addTrackToChannel";
import createChannel from "./handlers/createChannel";

export function createRouter(config: Config, knexConnection: knex): Router {
  const router = new Router();
  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  });

  router.get("/healthcheck", ctx => (ctx.status = 200));

  router.post("/channels/create", bodyparser(), jwtMiddleware, createChannel(config, knexConnection));

  router.post("/channels/:channelId/tracks/add", bodyparser(), jwtMiddleware, addTrackToChannel(config, knexConnection));

  return router;
}
