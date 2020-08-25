import { hostname } from "os"
import * as winston from "winston"

const logger = winston.createLogger({
  level: "debug", // process.env.NODE_ENV === "production" ? "info" : "debug",
  defaultMeta: { hostname: hostname() },
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
})

export default logger
