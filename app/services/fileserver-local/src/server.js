const createApp = require("./app")
const config = require("./config")
const logger = require("./logger")

const app = createApp(config)

const server = app.listen(config.PORT, () => {
  logger.debug(`Server is listening on port ${config.PORT}`)
})

module.exports = server
