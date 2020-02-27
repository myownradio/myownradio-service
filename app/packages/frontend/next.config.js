const withImages = require("next-images");
const environment = require("./environment");

module.exports = withImages({
  env: environment[process.env.NODE_ENV]
});
