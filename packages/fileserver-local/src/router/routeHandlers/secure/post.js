const { join, dirname } = require("path");
const { exists, mkdir, rename } = require("fs");
const { promisify } = require("util");

const existsAsync = promisify(exists);
const mkdirAsync = promisify(mkdir);
const renameAsync = promisify(rename);

module.exports = function createGetHandler(config) {
  return async ctx => {
    const filepath = join(config.contentDir, ctx.request.path);

    const fileDirName = dirname(filepath);

    const exists = await existsAsync(fileDirName);

    if (!exists) {
      await mkdirAsync(fileDirName, { recursive: true });
    }

    if (!ctx.request.files.source) {
      ctx.throw(400, "No file uploaded");
    }

    const { source } = ctx.request.files;

    await renameAsync(source.path, filepath);

    ctx.status = 200;
  };
};
