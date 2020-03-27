const body = require("koa-body");
const jwtMiddleware = require("koa-jwt");
const Router = require("koa-router");

const createUploadHandler = require("./upload");

module.exports = function createRouter(config) {
  const router = new Router();

  router.post(
    "/upload",
    jwtMiddleware({
      secret: config.tokenSecret,
    }),
    body({
      multipart: true,
      formidable: {
        hash: "sha1",
        uploadDir: config.tempDir,
      },
    }),
    createUploadHandler(config),
  );

  return router;
};
