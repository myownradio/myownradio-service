const { assert } = require("@myownradio/shared");

const {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
  PORT
} = process.env;

const config = {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
  PORT
};

assert(typeof config.PORT === "string");
assert(typeof config.AUTH_SERVER_TOKEN_SECRET === "string");
assert(typeof config.AUTH_SERVER_DATABASE_URL === "string");
assert(typeof config.AUTH_SERVER_DATABASE_CLIENT === "string");
assert(typeof config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME === "string");

module.exports = config;
