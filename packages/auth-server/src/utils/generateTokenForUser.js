const crypto = require("crypto");

module.exports = function generateTokenForUser() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(buffer.toString("hex"));
    });
  });
};
