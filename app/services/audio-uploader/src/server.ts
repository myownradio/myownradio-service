import { createApp } from "./app"
import { Config } from "./config"
import { logger } from "./logger"

try {
  const config = new Config(process.env)
  const app = createApp(config)
  const server = app.listen(config.httpServerPort, () => {
    logger.debug(`Server is listening on port ${config.httpServerPort}`)
  })

  let shutdownStarted = false

  const shutdown = async (exitCode: number): Promise<void> => {
    if (shutdownStarted) {
      logger.warn("Forceful shutdown")
      process.exit(5)
    } else {
      logger.info("Shutting down application")
    }
    shutdownStarted = true

    try {
      await new Promise((resolve, reject) => server.close(error => (error ? reject(error) : resolve())))
    } catch (error) {
      const errorText = error.stack || error
      logger.warn(`Error happened on shutdown: ${errorText}`)
    }

    process.exit(exitCode)
  }

  process.on("SIGINT", () => shutdown(0))
  process.on("SIGTERM", () => shutdown(0))
} catch (error) {
  const errorText = error.stack || error
  logger.error(errorText)
  process.exit(1)
}
