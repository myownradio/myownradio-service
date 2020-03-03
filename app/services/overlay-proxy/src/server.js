const createAppServer = require("./app");
const config = require("./config");

const server = createAppServer(config);

server.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening Port: ${config.PORT}`);
});
