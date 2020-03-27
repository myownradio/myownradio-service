const createApp = require("./app");
const { Config } = require("./config");

const config = new Config(process.env);

const app = createApp(config);

const server = app.listen(config.httpServerPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening Port: ${config.httpServerPort}`);
});

module.exports = server;
