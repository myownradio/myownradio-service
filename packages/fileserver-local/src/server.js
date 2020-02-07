const createApp = require("./app");
const config = require("./config");

const app = createApp(config);

const server = app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Content Directory: ${config.ROOT_FOLDER}`);
  // eslint-disable-next-line no-console
  console.log(`Listening Port: ${config.PORT}`);
});

module.exports = server;
