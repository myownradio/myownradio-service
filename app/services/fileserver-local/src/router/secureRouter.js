const Router = require("koa-router");
const body = require("koa-body");
const jwtMiddleware = require("koa-jwt");
const createGetHandler = require("./routeHandlers/secure/get");
const createPostHandler = require("./routeHandlers/secure/post");
const createDeleteHandler = require("./routeHandlers/secure/del");
const check = require("../middleware/checkPermission");

module.exports = function createSecureRouter(config) {
  const secureRouter = new Router();

  secureRouter.use(
    jwtMiddleware({ secret: config.FILESERVER_LOCAL_TOKEN_SECRET })
  );

  secureRouter.get("*", check("read"), createGetHandler(config));
  secureRouter.post(
    "*",
    check("write"),
    body({ multipart: true }),
    createPostHandler(config)
  );
  secureRouter.del("*", check("write"), createDeleteHandler(config));

  return secureRouter;
};
