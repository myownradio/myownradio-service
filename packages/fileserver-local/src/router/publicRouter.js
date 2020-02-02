const Router = require("koa-router");
const createIndexHandler = require("./routeHandlers/public/index");

module.exports = function createPublicRouter() {
  const publicRouter = new Router();

  publicRouter.all("/", createIndexHandler());

  return publicRouter;
};
