import fs = require("fs")
import { Context } from "koa"

export async function cleanupUploads(ctx: Context, next: () => Promise<void>): Promise<void> {
  try {
    await next()
  } finally {
    if (ctx.request.files) {
      const tempFiles = Object.values(ctx.request.files).map(file => file.path)
      await Promise.all(tempFiles.map(tmpFile => fs.promises.unlink(tmpFile)))
    }
  }
}
