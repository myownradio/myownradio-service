const enumerate = require("../utils/enumerate");

module.exports = enumerate(
  "WRONG_EMAIL_OR_PASSWORD",
  "EMAIL_AND_PASSWORD_REQUIRED",
  "UNAUTHORIZED",
  "REFRESH_TOKEN_REQUIRED",
  "INVALID_REFRESH_TOKEN",
  "EMAIL_ALREADY_IN_USE",
);
