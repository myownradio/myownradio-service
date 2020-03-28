const fs = require("fs");
const path = require("path");

const { fileExists, hashToPath, getMediaFileMetadata, createSignatureForMetadata } = require("../utils");

module.exports = function createUploadHandler(config) {
  return async ctx => {
    if (!(ctx.request.files || {}).source) {
      ctx.throw(400);
    }

    const { source } = ctx.request.files;
    const { name, hash } = source;
    const extension = path.extname(name);
    const hashPath = hashToPath(hash);

    const [metadata, { size }] = await Promise.all([getMediaFileMetadata(source.path), fs.promises.stat(source.path)]);

    const filepath = path.join(config.rootDir, `${hashPath}${extension}`);

    if (await fileExists(filepath)) {
      await fs.promises.unlink(source.path);
    } else {
      await fs.promises.rename(source.path, filepath);
    }

    const body = { hash, size, name, path: hashPath, ...metadata };
    const rawBody = JSON.stringify(body);
    const signature = createSignatureForMetadata(rawBody, config.tokenSecret);

    ctx.set("signature", signature);
    ctx.set("content-type", "application/json");

    ctx.body = rawBody;
  };
};
