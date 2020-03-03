const { assert } = require("@myownradio/shared");

const {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
  AUTH_SERVER_REFRESH_TOKEN_LIFETIME,
  AUTH_SERVER_ALLOWED_ORIGIN,
  PORT = String(8080)
} = process.env;

const config = {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
  AUTH_SERVER_REFRESH_TOKEN_LIFETIME,
  AUTH_SERVER_ALLOWED_ORIGIN,
  PORT
};

assert(typeof config.PORT === "string");
assert(typeof config.AUTH_SERVER_TOKEN_SECRET === "string");
assert(typeof config.AUTH_SERVER_DATABASE_URL === "string");
assert(typeof config.AUTH_SERVER_DATABASE_CLIENT === "string");
assert(typeof config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME === "string");
assert(typeof config.AUTH_SERVER_REFRESH_TOKEN_LIFETIME === "string");
assert(typeof config.AUTH_SERVER_ALLOWED_ORIGIN === "string");

module.exports = config;
