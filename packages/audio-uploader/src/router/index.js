const Router = require("koa-router");
const body = require("koa-body");
const jwtMiddleware = require("koa-jwt");

const createUploadHandler = require("./upload");
const createGetHandler = require("./get");

module.exports = function createRouter(config) {
  const router = new Router();

  router.get("*", createGetHandler());

  router.post(
    "/upload",
    jwtMiddleware({ secret: config.AUDIO_UPLOADER_TOKEN_SECRET }),
    body({ multipart: true }),
    createUploadHandler(config)
  );

  return router;
};
