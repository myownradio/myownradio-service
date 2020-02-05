const { exists } = require("fs");
const { promisify } = require("util");
const path = require("path");
const { koaHelpers } = require("@myownradio/shared");

const existsAsync = promisify(exists);

module.exports = function createGetHandler(config) {
  return async ctx => {
    const filepath = path.join(config.contentDir, ctx.request.path);

    if (!(await existsAsync(filepath))) {
      ctx.throw(404);
    }

    await koaHelpers.download(ctx, filepath);
  };
};
