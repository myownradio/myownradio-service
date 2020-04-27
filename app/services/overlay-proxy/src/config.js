const { assert } = require("@myownradio/shared")

const { OVERLAY_PROXY_PERMANENT_SERVER, OVERLAY_PROXY_TEMPORARY_SERVER, PORT } = process.env

const config = {
  OVERLAY_PROXY_PERMANENT_SERVER,
  OVERLAY_PROXY_TEMPORARY_SERVER,
  PORT,
}

assert(typeof config.PORT === "string")
assert(typeof config.OVERLAY_PROXY_PERMANENT_SERVER === "string")
assert(typeof config.OVERLAY_PROXY_TEMPORARY_SERVER === "string")

module.exports = config
