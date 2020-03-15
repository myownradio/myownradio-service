const { assert } = require("@myownradio/shared");

const {
  EMAIL_SENDER_SMTP_HOST,
  EMAIL_SENDER_SMTP_USER,
  EMAIL_SENDER_SMTP_PASSWORD,
  EMAIL_SENDER_SMTP_PORT,
  PORT,
} = process.env;
const EMAIL_SENDER_SMTP_SECURE = process.env.EMAIL_SENDER_SMTP_SECURE === "yes";

const config = {
  EMAIL_SENDER_SMTP_HOST,
  EMAIL_SENDER_SMTP_USER,
  EMAIL_SENDER_SMTP_PASSWORD,
  EMAIL_SENDER_SMTP_PORT,
  EMAIL_SENDER_SMTP_SECURE,
  PORT,
};

assert(typeof config.PORT === "string");
assert(typeof config.EMAIL_SENDER_SMTP_HOST === "string");
assert(typeof config.EMAIL_SENDER_SMTP_USER === "string");
assert(typeof config.EMAIL_SENDER_SMTP_PASSWORD === "string");
assert(typeof config.EMAIL_SENDER_SMTP_PORT === "string");
assert(typeof config.EMAIL_SENDER_SMTP_SECURE === "boolean");

module.exports = config;
