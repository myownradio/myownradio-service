import fs = require("fs")
import path = require("path")
import { createSignature } from "@myownradio/common/crypto/signature"
import { convertFileHashToFilePath } from "@myownradio/common/fileserver"
import { fileExists } from "@myownradio/common/fs"
import { Middleware } from "koa"
import { supportedAudioExtensions, supportedAudioFormats } from "../constants"
import { getMediaFileMetadata } from "../utils"

export function createUploadHandler(config): Middleware {
  return async (ctx): Promise<void> => {
    if (!(ctx.request.files || {}).source) {
      ctx.throw(400)
    }

    const { source } = ctx.request.files
    const { name, hash } = source
    const extension = path.extname(name).toLowerCase()

    if (!supportedAudioExtensions.has(extension)) {
      ctx.throw(415)
    }

    const [metadata, { size }] = await Promise.all([getMediaFileMetadata(source.path), fs.promises.stat(source.path)])

    if (!supportedAudioFormats.has(metadata.format)) {
      ctx.throw(415)
    }

    const hashPath = convertFileHashToFilePath(hash)
    const filepath = path.join(config.rootDir, `${hashPath}${extension}`)

    if (!(await fileExists(filepath))) {
      await fs.promises.mkdir(path.dirname(filepath), { recursive: true })
      await fs.promises.copyFile(source.path, filepath)
    }

    const body = { hash, size, name, ...metadata }
    const rawBody = JSON.stringify(body)
    const signature = createSignature(rawBody, config.metadataSecret)

    ctx.set("signature", signature)
    ctx.set("content-type", "application/json")

    ctx.body = rawBody
  }
}
