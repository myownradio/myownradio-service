import * as createJwtMiddleware from "koa-jwt";
import * as Router from "koa-router";
import { Config } from "../config";
import getNowPlaying from "./handlers/getNowPlaying";
import pauseRadioChannel from "./handlers/pauseRadioChannel";
import startRadioChannel from "./handlers/startRadioChannel";
import stopRadioChannel from "./handlers/stopRadioChannel";

export function createRouter(config: Config): Router {
  const router = new Router();

  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  });

  router.get("channels/:channelId(\\d+)/nowPlaying", jwtMiddleware, getNowPlaying());
  router.post("channels/:channelId(\\d+)/start", jwtMiddleware, startRadioChannel());
  router.post("channels/:channelId(\\d+)/stop", jwtMiddleware, stopRadioChannel());
  router.post("channels/:channelId(\\d+)/pause", jwtMiddleware, pauseRadioChannel());

  router.get("/healthcheck", ctx => (ctx.status = 200));

  return router;
}
