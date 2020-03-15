const fs = require("fs");
const path = require("path");

const { fileExists } = require("@myownradio/shared").fsHelpers;

module.exports = function createDeleteHandler(config) {
  return async ctx => {
    const filepath = path.join(config.FILESERVER_LOCAL_ROOT_FOLDER, ctx.request.path);

    if (!(await fileExists(filepath))) {
      ctx.throw(404);
    }

    await fs.promises.unlink(filepath);

    ctx.status = 200;
  };
};
