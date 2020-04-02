import requestLogger from "./router/middleware/requestLogger";

const cors = require("@koa/cors");
const Application = require("koa");

const createRouter = require("./router");

module.exports = function createApp(config, knexConnection, logger) {
  const app = new Application();
  const router = createRouter(config, knexConnection);

  app.use(requestLogger(logger));
  app.use(cors({ credentials: true, origin: config.AUTH_SERVER_ALLOWED_ORIGIN }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
