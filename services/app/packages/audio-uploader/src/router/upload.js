const path = require("path");
const fs = require("fs");
const { hashToPath } = require("@myownradio/shared").utils;
const { fileExists } = require("@myownradio/shared").fsHelpers;

const getMediaFileMetadata = require("../utils/getMediaFileMetadata");

module.exports = function createUploadHandler(config) {
  return async ctx => {
    if (!(ctx.request.files || {}).source) {
      ctx.throw(400, "No file uploaded");
    }

    const { source } = ctx.request.files;
    const { name, hash } = source;
    const extension = path.extname(name);
    const hashPath = hashToPath(hash);

    const [metadata, { size }] = await Promise.all([
      getMediaFileMetadata(source.path),
      fs.promises.stat(source.path)
    ]);

    const filepath = path.join(
      config.AUDIO_UPLOADER_ROOT_FOLDER,
      `${hashPath}${extension}`
    );

    if (await fileExists(filepath)) {
      await fs.promises.unlink(source.path);
    } else {
      await fs.promises.rename(source.path, filepath);
    }

    ctx.body = { hash, size, name, path: hashPath, ...metadata };
  };
};
