const Application = require("koa");
const createPublicRouter = require("./router/publicRouter");
const createSecureRouter = require("./router/secureRouter");

module.exports = function createApp(config) {
  const app = new Application();
  const publicRouter = createPublicRouter(config);
  const secureRouter = createSecureRouter(config);

  app.use(publicRouter.routes(), publicRouter.allowedMethods());
  app.use(secureRouter.routes(), secureRouter.allowedMethods());

  return app;
};
