import { Container } from "inversify"
import * as Router from "koa-router"

export function createRouter(container: Container): Router {
  const router = new Router()

  return router
}
