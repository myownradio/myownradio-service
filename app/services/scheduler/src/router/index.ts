import * as knex from "knex"
import * as createJwtMiddleware from "koa-jwt"
import * as Router from "koa-router"
import { Logger } from "winston"
import { Config } from "../config"
import { TimeService } from "../time"
import getNowPlaying from "./handlers/getNowPlaying"
import pauseRadioChannel from "./handlers/pauseRadioChannel"
import resumeRadioChannel from "./handlers/resumeRadioChannel"
import startRadioChannel from "./handlers/startRadioChannel"
import stopRadioChannel from "./handlers/stopRadioChannel"

export function createRouter(config: Config, knexConnection: knex, logger: Logger, timeService: TimeService): Router {
  const router = new Router()

  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  })

  router.get("/channels/:channelId(\\d+)/nowPlaying", jwtMiddleware, getNowPlaying(knexConnection, timeService))
  router.post(
    "/channels/:channelId(\\d+)/start",
    jwtMiddleware,
    startRadioChannel(config, knexConnection, logger, timeService),
  )
  router.post("/channels/:channelId(\\d+)/stop", jwtMiddleware, stopRadioChannel(config, knexConnection, logger))
  router.post(
    "/channels/:channelId(\\d+)/pause",
    jwtMiddleware,
    pauseRadioChannel(config, knexConnection, logger, timeService),
  )
  router.post(
    "/channels/:channelId(\\d+)/resume",
    jwtMiddleware,
    resumeRadioChannel(config, knexConnection, logger, timeService),
  )

  router.get("/healthcheck", ctx => (ctx.status = 200))

  return router
}
