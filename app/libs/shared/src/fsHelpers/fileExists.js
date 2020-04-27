const fs = require("fs")

/**
 * Checks whether file exists.
 *
 * @param {string} path
 * @return {Promise<boolean>}
 */
module.exports = async function fileExists(path) {
  return fs.promises.access(path, fs.constants.F_OK).then(
    () => true,
    () => false,
  )
}
