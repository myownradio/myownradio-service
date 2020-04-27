const http = require("http")

const axios = require("axios")

module.exports = function createAppServer(config) {
  return http.createServer(async (req, res) => {
    const { url } = req

    const locations = [config.OVERLAY_PROXY_PERMANENT_SERVER, config.OVERLAY_PROXY_TEMPORARY_SERVER]

    try {
      const foundOnServer = await Promise.race(
        locations.map(loc => {
          const location = `${loc}${url}`
          return axios.head(location).then(() => location)
        }),
      )

      res.statusCode = 302
      res.setHeader("location", foundOnServer)
      res.end()
    } catch (e) {
      res.statusCode = 404
      res.end()
    }
  })
}
