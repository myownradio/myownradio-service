const cors = require("@koa/cors");
const Application = require("koa");

const createRouter = require("./router");

module.exports = function createApp(config) {
  const app = new Application();
  const router = createRouter(config);

  app.use(cors({ credentials: true, origin: config.allowedOrigin, exposeHeaders: ["signature"] }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
