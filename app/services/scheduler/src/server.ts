import * as knex from "knex";
import { createApp } from "./app";
import { Config } from "./config";
import logger from "./logger";
import { BaseTimeService } from "./time";

try {
  const config = new Config(process.env);

  const knexConnection = knex({
    connection: config.databaseUrl,
    client: config.databaseClient,
    pool: { min: 0, max: 10 },
  });

  const timeService = new BaseTimeService();

  const app = createApp(config, knexConnection, logger, timeService);

  const server = app.listen(config.httpServerPort, () => {
    logger.debug(`Server is listening on port ${config.httpServerPort}`);
  });

  let shuttingDown = false;

  async function shutdown(exitCode: number): Promise<void> {
    if (shuttingDown) {
      logger.warn("Forceful shutdown");
      process.exit(5);
    } else {
      logger.info("Shutting down service");
    }
    shuttingDown = true;

    try {
      await new Promise((resolve, reject) => {
        server.close(error => {
          error ? reject(error) : resolve();
        });
      });
    } catch (error) {
      const errorText = (error.stack || error) as string;
      logger.warn(`Error happened on shutdown: ${errorText}`);
    }

    try {
      await knexConnection.destroy();
    } catch (error) {
      const errorText = (error.stack || error) as string;
      logger.warn(`Error happened on shutdown: ${errorText}`);
    }

    process.exit(exitCode);
  }

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
} catch (error) {
  const errorText = (error.stack || error) as string;
  logger.error(`Error happened on service start: ${errorText}`);
  process.exit(1);
}
