import * as cors from "@koa/cors";
import * as knex from "knex";
import * as Application from "koa";
import { Logger } from "winston";
import { Config } from "./config";
import { createRouter } from "./router";
import requestLogger from "./router/middleware/requestLogger";

export function createApp(config: Config, knexConnection: knex, logger: Logger): Application {
  const app = new Application();

  app.use(requestLogger(logger));
  app.use(cors({ credentials: true, origin: config.allowedOrigin }));

  const router = createRouter(config, knexConnection, logger);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
