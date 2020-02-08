const Application = require("koa");

module.exports = function createApp(config, knexConnection) {
  const app = new Application();
  return app;
};
