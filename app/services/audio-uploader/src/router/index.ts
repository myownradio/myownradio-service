import body = require("koa-body")
import jwtMiddleware = require("koa-jwt")
import Router = require("koa-router")
import { Config } from "../config"
import { cleanupUploads } from "./middleware/cleanupUploads"
import { createUploadHandler } from "./upload"

export function createRouter(config: Config): Router {
  const router = new Router()

  router.post(
    "/upload",
    jwtMiddleware({ secret: config.tokenSecret }),
    cleanupUploads,
    body({
      multipart: true,
      formidable: {
        hash: "sha1",
        uploadDir: config.tempDir,
      },
    }),
    createUploadHandler(config),
  )

  return router
}
