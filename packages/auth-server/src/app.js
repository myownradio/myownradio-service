const Application = require("koa");
const createRouter = require("./router");

module.exports = function createApp(config, knexConnection) {
  const app = new Application();
  const router = createRouter(config, knexConnection);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
