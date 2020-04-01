import * as knex from "knex";
import * as bodyparser from "koa-bodyparser";
import * as createJwtMiddleware from "koa-jwt";
import * as Router from "koa-router";
import { Logger } from "winston";
import { Config } from "../config";
import addTrackToChannel from "./handlers/addTrackToChannel";
import createChannel from "./handlers/createChannel";
import getChannels from "./handlers/getChannels";

export function createRouter(config: Config, knexConnection: knex, _logger: Logger): Router {
  const router = new Router();
  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  });

  router.get("/healthcheck", ctx => (ctx.status = 200));
  router.get("/channels", jwtMiddleware, getChannels(config, knexConnection));
  router.post("/channels/create", bodyparser(), jwtMiddleware, createChannel(config, knexConnection));
  router.post("/channels/:channelId/tracks/add", bodyparser(), jwtMiddleware, addTrackToChannel(config, knexConnection));

  return router;
}
