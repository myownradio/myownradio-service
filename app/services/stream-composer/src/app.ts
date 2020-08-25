import { Container } from "inversify"
import * as Application from "koa"
import { createRouter } from "./routes/createRouter"

export function createApp(container: Container): Application {
  const app = new Application()
  const router = createRouter(container)

  app.use(router.routes())
  app.use(router.allowedMethods())

  return app
}
