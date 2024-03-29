import * as cors from "@koa/cors"
import { requestLogger } from "@myownradio/shared-server/lib/koa/mw"
import * as knex from "knex"
import * as Application from "koa"
import { Logger } from "winston"
import { Config } from "./config"
import { createRouter } from "./router"

export function createApp(config: Config, knexConnection: knex, logger: Logger): Application {
  const app = new Application()
  const router = createRouter(knexConnection, config, logger)

  app.use(requestLogger(logger))
  app.use(cors({ credentials: true, origin: config.allowedOrigin }))

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
