import fs = require("fs")
import path = require("path")
import { signature as signatureUtils, pathUtils, fsUtils } from "@myownradio/shared-server"
import { Middleware } from "koa"
import { Config } from "../config"
import { supportedAudioExtensions, supportedAudioFormats } from "../constants"
import { getMediaFileMetadata } from "../utils"

export function createUploadHandler(config: Config): Middleware {
  return async (ctx): Promise<void> => {
    if (!ctx.request.files) {
      ctx.throw(400)
      return
    }

    const { source } = ctx.request.files

    if (!source) {
      ctx.throw(400)
      return
    }

    const { name, hash } = source

    if (!hash) {
      ctx.throw(500)
      return
    }

    const extension = path.extname(name).toLowerCase()

    if (!supportedAudioExtensions.has(extension)) {
      ctx.throw(415)
    }

    const [metadata, { size }] = await Promise.all([getMediaFileMetadata(source.path), fs.promises.stat(source.path)])

    if (!supportedAudioFormats.has(metadata.format)) {
      ctx.throw(415)
    }

    const hashPath = pathUtils.convertFileHashToFilePath(hash)
    const filepath = path.join(config.rootDir, `${hashPath}${extension}`)

    if (!(await fsUtils.fileExists(filepath))) {
      await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
      await fs.promises.copyFile(source.path, filepath)
    }

    const body = { hash, size, name, ...metadata }
    const rawBody = JSON.stringify(body)
    const signature = signatureUtils.createSignature(rawBody, config.metadataSecret)

    ctx.set("signature", signature)
    ctx.set("content-type", "application/json")

    ctx.body = rawBody
  }
}
