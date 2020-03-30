import * as knex from "knex";
import * as Application from "koa";
import { Config } from "./config";
import { createRouter } from "./router";

export function createApp(config: Config, knexConnection: knex): Application {
  const app = new Application();

  // app.use(cors({ credentials: true, origin: config.AUTH_SERVER_ALLOWED_ORIGIN }));

  const router = createRouter(config, knexConnection);

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
