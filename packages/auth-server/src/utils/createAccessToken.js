const jwt = require("jsonwebtoken");

/**
 * @param {string} tokenSecret
 * @param {number} tokenLifetime
 * @return {Promise<string>}
 */
module.exports = async function createAccessToken(tokenSecret, tokenLifetime) {
  const exp = Math.floor(Date.now() / 1000) + tokenLifetime;
  return jwt.sign({ exp }, tokenSecret, {});
};
