const crypto = require("crypto");

module.exports = function generateTokenForUser(userId) {
  return crypto
    .createHash("sha1")
    .update(String(userId))
    .update(String(Date.now()))
    .digest("hex");
};
