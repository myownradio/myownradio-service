const Application = require("koa");
const cors = require("@koa/cors");
const createRouter = require("./router");

module.exports = function createApp(config, knexConnection) {
  const app = new Application();
  const router = createRouter(config, knexConnection);

  app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};
