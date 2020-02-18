const withImages = require("next-images");
const environment = require("./environment");

module.exports = withImages({
  webpack(config) {
    return config;
  },
  env: environment[process.env.NODE_ENV]
});
