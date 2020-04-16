import * as Application from "koa";
import { Logger } from "winston";
import { Config } from "./config";
import { createRouter } from "./router";
import requestLogger from "./router/middleware/requestLogger";

export function createApp(_: Config, logger: Logger): Application {
  const app = new Application();
  const router = createRouter();

  app.use(requestLogger(logger));

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
