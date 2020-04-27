const createAppServer = require("./app")
const config = require("./config")
const logger = require("./logger")

const server = createAppServer(config)

server.listen(config.PORT, () => {
  logger.debug(`Server is listening on port ${config.PORT}`)
})
