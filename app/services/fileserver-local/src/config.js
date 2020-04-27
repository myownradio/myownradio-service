const { assert } = require("@myownradio/shared")

const { FILESERVER_LOCAL_ROOT_FOLDER, FILESERVER_LOCAL_TOKEN_SECRET, PORT } = process.env

const config = {
  FILESERVER_LOCAL_ROOT_FOLDER,
  FILESERVER_LOCAL_TOKEN_SECRET,
  PORT,
}

assert(typeof config.PORT === "string")
assert(typeof config.FILESERVER_LOCAL_ROOT_FOLDER === "string")
assert(typeof config.FILESERVER_LOCAL_TOKEN_SECRET === "string")

module.exports = config
