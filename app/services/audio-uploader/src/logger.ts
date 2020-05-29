import * as os from "os"
import * as winston from "winston"

export const logger = winston.createLogger({
  level: "debug",
  defaultMeta: { hostname: os.hostname() },
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
})
