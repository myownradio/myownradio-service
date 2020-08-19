import * as cors from "@koa/cors"
import { requestLogger } from "@myownradio/shared-server/lib/koa/mw"
import { Container } from "inversify"
import * as Application from "koa"
import { Logger } from "winston"
import { Config } from "./config"
import { ConfigType, LoggerType } from "./di/types"
import { validationErrorMiddleware } from "./io"
import { createRouter } from "./router"

export function createApp(container: Container): Application {
  const config = container.get<Config>(ConfigType)
  const logger = container.get<Logger>(LoggerType)

  const app = new Application()

  app.use(validationErrorMiddleware)
  app.use(requestLogger(logger))
  app.use(cors({ credentials: true, origin: config.allowedOrigin }))

  const router = createRouter(container)

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
