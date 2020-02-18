const Router = require("koa-router");
const body = require("koa-body");
const jwtMiddleware = require("koa-jwt");

const createUploadHandler = require("./upload");
const createGetHandler = require("./get");

module.exports = function createRouter(config) {
  const router = new Router();

  router.get("*", createGetHandler(config));

  router.post(
    "/upload",
    jwtMiddleware({ secret: config.AUDIO_UPLOADER_TOKEN_SECRET }),
    body({
      multipart: true,
      formidable: { hash: "sha1", uploadDir: config.AUDIO_UPLOADER_TEMP_DIR }
    }),
    createUploadHandler(config)
  );

  return router;
};
