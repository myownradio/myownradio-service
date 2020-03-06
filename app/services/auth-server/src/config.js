const { assert } = require("@myownradio/shared");
const parse = require("parse-strings-in-object");

const {
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
  AUTH_SERVER_REFRESH_TOKEN_LIFETIME,
  AUTH_SERVER_ALLOWED_ORIGIN,
  PORT = String(8080)
} = process.env;

const config = parse({
  AUTH_SERVER_TOKEN_SECRET,
  AUTH_SERVER_DATABASE_URL,
  AUTH_SERVER_DATABASE_CLIENT,
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
  AUTH_SERVER_REFRESH_TOKEN_LIFETIME,
  AUTH_SERVER_ALLOWED_ORIGIN,
  PORT
});

assert(typeof config.PORT === "number");
assert(typeof config.AUTH_SERVER_TOKEN_SECRET === "string");
assert(typeof config.AUTH_SERVER_DATABASE_URL === "string");
assert(typeof config.AUTH_SERVER_DATABASE_CLIENT === "string");
assert(typeof config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME === "number");
assert(typeof config.AUTH_SERVER_REFRESH_TOKEN_LIFETIME === "number");
assert(typeof config.AUTH_SERVER_ALLOWED_ORIGIN === "string");

module.exports = config;
