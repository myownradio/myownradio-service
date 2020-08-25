import axios from "axios"
import "reflect-metadata"
import { Container } from "inversify"
import { createApp } from "./app"
import { Config } from "./config"
import { AxiosClientType, ConfigType, LoggerType } from "./di/types"
import logger from "./logger"
import { AudioDecoder, AudioDecoderImpl } from "./services/AudioDecoder"
import { ChannelPlayer, ChannelPlayerImpl } from "./services/ChannelPlayer"
import { RadioManagerClient, RadioManagerClientImpl } from "./services/RadioManagerClient"

try {
  const config = new Config(process.env)

  const container = new Container()

  container.bind(ConfigType).toConstantValue(config)
  container.bind(AxiosClientType).toConstantValue(axios.create())
  container.bind(LoggerType).toConstantValue(logger)

  container.bind(AudioDecoder).to(AudioDecoderImpl)
  container.bind(ChannelPlayer).to(ChannelPlayerImpl)
  container.bind(RadioManagerClient).to(RadioManagerClientImpl)

  const app = createApp(container)

  const server = app.listen(config.httpServerPort, () => {
    logger.debug(`Server is listening on port ${config.httpServerPort}`)
  })

  let shuttingDown = false

  async function shutdown(exitCode: number): Promise<void> {
    if (shuttingDown) {
      logger.warn("Forceful shutdown")
      process.exit(5)
    } else {
      logger.info("Shutting down service")
    }
    shuttingDown = true

    try {
      await new Promise((resolve, reject) => {
        server.close(error => {
          error ? reject(error) : resolve()
        })
      })
    } catch (error) {
      const errorText = (error.stack || error) as string
      logger.warn(`Error happened on shutdown: ${errorText}`)
    }

    process.exit(exitCode)
  }

  process.on("SIGINT", () => shutdown(0))
  process.on("SIGTERM", () => shutdown(0))
} catch (error) {
  const errorText = (error.stack || error) as string
  logger.error(`Error happened on service start: ${errorText}`)
  process.exit(1)
}
