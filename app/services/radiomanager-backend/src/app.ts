import * as Application from "koa";
import { Config } from "./config";
import { createRouter } from "./router";

export function createApp(config: Config): Application {
  const app = new Application();

  const router = createRouter(config);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
