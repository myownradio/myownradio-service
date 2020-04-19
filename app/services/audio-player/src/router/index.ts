import * as knex from "knex";
import * as jwtMiddleware from "koa-jwt";
import * as KoaRouter from "koa-router";
import { Logger } from "winston";
import { Config } from "../config";
import audioPreview from "./handlers/audioPreview";

export function createRouter(knexConnection: knex, config: Config, logger: Logger): KoaRouter {
  const router = new KoaRouter();

  router.get("/healthcheck", ctx => (ctx.status = 200));

  router.get(
    "/audio/preview/:trackId(\\d+)",
    jwtMiddleware({
      secret: config.tokenSecret,
    }),
    audioPreview(knexConnection, config, logger),
  );

  return router;
}
