import * as knex from "knex";
import * as Application from "koa";
import { Logger } from "winston";
import { Config } from "./config";
import { createRouter } from "./router";
import requestLogger from "./router/middleware/requestLogger";

export function createApp(config: Config, knexConnection: knex, logger: Logger): Application {
  const app = new Application();

  app.use(requestLogger(logger));
  // app.use(cors({ credentials: true, origin: config.AUTH_SERVER_ALLOWED_ORIGIN }));

  const router = createRouter(config, knexConnection, logger);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
