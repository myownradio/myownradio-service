const path = require("path");
const fs = require("fs");

const { fileExists } = require("@myownradio/shared").fsHelpers;

module.exports = function createGetHandler(config) {
  return async ctx => {
    const filepath = path.join(
      config.FILESERVER_LOCAL_ROOT_FOLDER,
      ctx.request.path
    );

    const fileDirName = path.dirname(filepath);

    if (!(await fileExists(fileDirName))) {
      await fs.promises.mkdir(fileDirName, { recursive: true });
    }

    if (!(ctx.request.files || {}).source) {
      ctx.throw(400, "No file uploaded");
    }

    const { source } = ctx.request.files;

    await fs.promises.rename(source.path, filepath);

    ctx.status = 200;
  };
};
