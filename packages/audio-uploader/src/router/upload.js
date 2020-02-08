// const path = require("path");
const fs = require("fs");

const getMediaFileMetadata = require("../utils/getMediaFileMetadata");

module.exports = function createUploadHandler(config) {
  return async ctx => {
    if (!ctx.request.files.source) {
      ctx.throw(400, "No file uploaded");
    }

    const { source } = ctx.request.files;
    const { name } = source;

    const [metadata, { size }] = await Promise.all([
      getMediaFileMetadata(source.path),
      fs.promises.stat(source.path)
    ]);

    await fs.promises.unlink(source.path);

    ctx.body = { hash: source.hash, size, name, ...metadata };
  };
};
