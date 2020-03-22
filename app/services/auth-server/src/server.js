const knex = require("knex");

const createApp = require("./app");
const config = require("./config");

const knexConnection = knex({
  connection: config.AUTH_SERVER_DATABASE_URL,
  client: config.AUTH_SERVER_DATABASE_CLIENT,
});

const app = createApp(config, knexConnection);

const server = app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening Port: ${config.PORT}`);
});

module.exports = server;
