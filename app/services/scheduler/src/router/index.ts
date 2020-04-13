import * as knex from "knex";
import * as createJwtMiddleware from "koa-jwt";
import * as Router from "koa-router";
import { Logger } from "winston";
import { Config } from "../config";
import getNowPlaying from "./handlers/getNowPlaying";
import pauseRadioChannel from "./handlers/pauseRadioChannel";
import startRadioChannel from "./handlers/startRadioChannel";
import stopRadioChannel from "./handlers/stopRadioChannel";

export function createRouter(config: Config, knexConnection: knex, logger: Logger): Router {
  const router = new Router();

  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  });

  router.get("/channels/:channelId(\\d+)/nowPlaying", jwtMiddleware, getNowPlaying());
  router.post("/channels/:channelId(\\d+)/start", jwtMiddleware, startRadioChannel(config, knexConnection, logger));
  router.post("/channels/:channelId(\\d+)/stop", jwtMiddleware, stopRadioChannel());
  router.post("/channels/:channelId(\\d+)/pause", jwtMiddleware, pauseRadioChannel());

  router.get("/healthcheck", ctx => (ctx.status = 200));

  return router;
}
