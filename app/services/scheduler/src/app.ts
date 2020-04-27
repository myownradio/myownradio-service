import * as cors from "@koa/cors"
import * as knex from "knex"
import * as Application from "koa"
import { Logger } from "winston"
import { Config } from "./config"
import { createRouter } from "./router"
import requestLogger from "./router/middleware/requestLogger"
import { TimeService } from "./time"

export function createApp(config: Config, knexConnection: knex, logger: Logger, timeService: TimeService): Application {
  const app = new Application()
  const router = createRouter(config, knexConnection, logger, timeService)

  app.use(requestLogger(logger))
  app.use(cors({ credentials: true, origin: config.allowedOrigin }))

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
