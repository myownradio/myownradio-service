const { exists, unlink } = require("fs");
const { promisify } = require("util");
const path = require("path");

const existsAsync = promisify(exists);
const unlinkAsync = promisify(unlink);

module.exports = function createDeleteHandler(config) {
  return async ctx => {
    const filepath = path.join(config.contentDir, ctx.request.path);

    if (!(await existsAsync(filepath))) {
      ctx.throw(404);
    }

    await unlinkAsync(filepath);

    ctx.status = 200;
  };
};
