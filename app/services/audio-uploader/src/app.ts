import Application = require("koa")
import cors = require("@koa/cors")
import { Config } from "./config"
import { createRouter } from "./router"

export function createApp(config: Config): Application {
  const app = new Application()
  const router = createRouter(config)

  app.use(cors({ credentials: true, origin: config.allowedOrigin, exposeHeaders: ["signature"] }))

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
