const path = require("path");

/**
 * Converts hash to path with sub directories.
 * 
 * @param {string} hash
 * @return {string}
 */
module.exports = function hashToPath(hash) {
  const parts = [hash.slice(0, 1), hash.slice(1, 2), hash];
  return parts.join(path.sep);
};
