const Router = require("koa-router");
const bodyparser = require("koa-bodyparser");
const jwt = require("koa-jwt");

const createIndexRouteHandler = require("./createIndexRouteHandler");
const createSignupRouteHandler = require("./createSignupRouteHandler");
const createLoginRouteHandler = require("./createLoginRouteHandler");
const createRefreshTokenRouteHandler = require("./createRefreshTokenRouteHandler");
const createMeRouteHandler = require("./createMeRouteHandler");

module.exports = function createRouter(config, knexConnection) {
  const router = new Router();

  router.get("/", createIndexRouteHandler());
  router.post(
    "/signup",
    bodyparser(),
    createSignupRouteHandler(config, knexConnection)
  );
  router.post(
    "/login",
    bodyparser(),
    createLoginRouteHandler(config, knexConnection)
  );
  router.post(
    "/refreshToken",
    bodyparser(),
    createRefreshTokenRouteHandler(config, knexConnection)
  );
  router.get(
    "/me",
    jwt({ secret: config.AUTH_SERVER_TOKEN_SECRET }),
    createMeRouteHandler(config, knexConnection)
  );

  return router;
};
