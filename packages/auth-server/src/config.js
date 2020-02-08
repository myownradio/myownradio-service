const { assert } = require("@myownradio/shared");

const {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  PORT
} = process.env;

const config = {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  PORT
};

assert(typeof config.PORT === "string");
assert(typeof config.AUTH_SERVER_TOKEN_SECRET === "string");
assert(typeof config.AUTH_SERVER_DATABASE_URL === "string");
assert(typeof config.AUTH_SERVER_DATABASE_CLIENT === "string");

module.exports = config;
