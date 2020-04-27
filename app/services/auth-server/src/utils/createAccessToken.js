const jwt = require("jsonwebtoken")

/**
 * @param {string} tokenSecret
 * @param {number} tokenLifetime
 * @param {number} userId
 * @return {Promise<string>}
 */
module.exports = async function createAccessToken(tokenSecret, tokenLifetime, userId) {
  const exp = Math.floor(Date.now() / 1000) + tokenLifetime
  return jwt.sign({ exp, uid: userId }, tokenSecret, {})
}
