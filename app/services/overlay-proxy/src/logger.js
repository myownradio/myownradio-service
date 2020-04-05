const os = require("os");
const winston = require("winston");

const logger = winston.createLogger({
  level: "debug",
  defaultMeta: { hostname: os.hostname() },
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

module.exports = logger;
