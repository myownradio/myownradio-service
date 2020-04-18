const bodyparser = require("koa-bodyparser");
const jwt = require("koa-jwt");
const Router = require("koa-router");

const createAuthRouteHandler = require("./createAuthRouteHandler");
const createForgotTokenRouteHandler = require("./createForgotTokenRouteHandler");
const createIndexRouteHandler = require("./createIndexRouteHandler");
const createIssueNewAccessTokenRouteHandler = require("./createIssueNewAccessTokenRouteHandler");
const createLoginRouteHandler = require("./createLoginRouteHandler");
const createMeRouteHandler = require("./createMeRouteHandler");
const createRefreshTokenRouteHandler = require("./createRefreshTokenRouteHandler");
const createSignupRouteHandler = require("./createSignupRouteHandler");

module.exports = function createRouter(config, knexConnection) {
  const router = new Router();

  router.get("/", createIndexRouteHandler());
  router.post("/signup", bodyparser(), createSignupRouteHandler(config, knexConnection));
  router.post("/login", bodyparser(), createLoginRouteHandler(config, knexConnection));
  router.post("/issue", bodyparser(), createIssueNewAccessTokenRouteHandler(config, knexConnection));
  router.post("/refreshToken", bodyparser(), createRefreshTokenRouteHandler(config, knexConnection));
  router.post("/forgotToken", bodyparser(), createForgotTokenRouteHandler(config, knexConnection));
  router.get("/me", jwt({ secret: config.AUTH_SERVER_TOKEN_SECRET }), createMeRouteHandler(config, knexConnection));
  router.get("/auth", jwt({ secret: config.AUTH_SERVER_TOKEN_SECRET }), createAuthRouteHandler(config, knexConnection));

  return router;
};
