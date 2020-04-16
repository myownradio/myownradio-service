import * as KoaRouter from "koa-router";
import previewAudioTrack from "./handlers/previewAudioTrack";

export function createRouter(): KoaRouter {
  const router = new KoaRouter();

  router.get("/healthcheck", ctx => (ctx.status = 200));

  router.get("/previewAudioTrack/:trackId", previewAudioTrack());

  return router;
}
