import { IMiddleware } from "koa-router";

export default function previewAudioTrack(): IMiddleware {
  return async (ctx): Promise<void> => {
    ctx.status = 501;
  };
}
