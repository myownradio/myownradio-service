const knex = require("knex");

const createApp = require("./app");
const config = require("./config");
const logger = require("./logger");

const knexConnection = knex({
  connection: config.AUTH_SERVER_DATABASE_URL,
  client: config.AUTH_SERVER_DATABASE_CLIENT,
});

const app = createApp(config, knexConnection, logger);

const server = app.listen(config.PORT, () => {
  logger.debug(`Server is listening on port ${config.PORT}`);
});

module.exports = server;
