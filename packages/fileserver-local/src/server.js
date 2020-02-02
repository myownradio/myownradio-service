const createApp = require("./app");
const config = require("./config");

const app = createApp(config);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Content Directory: ${config.contentDir}`);
  console.log(`Listening Port: ${port}`);
});
