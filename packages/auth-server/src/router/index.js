const Router = require("koa-router");
const bodyparser = require("koa-bodyparser");

const createIndexRouteHandler = require("./createIndexRouteHandler");
const createSignupRouteHandler = require("./createSignupRouteHandler");

module.exports = function createRouter(config, knexConnection) {
  const router = new Router();

  router.get("/", createIndexRouteHandler());
  router.post(
    "/signup",
    bodyparser(),
    createSignupRouteHandler(config, knexConnection)
  );

  return router;
};
