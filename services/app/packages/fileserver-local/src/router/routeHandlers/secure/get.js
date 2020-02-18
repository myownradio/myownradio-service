const path = require("path");

const { koaHelpers, fsHelpers } = require("@myownradio/shared");

module.exports = function createGetHandler(config) {
  return async ctx => {
    const filepath = path.join(
      config.FILESERVER_LOCAL_ROOT_FOLDER,
      ctx.request.path
    );

    if (!(await fsHelpers.fileExists(filepath))) {
      ctx.throw(404);
    }

    await koaHelpers.download(ctx, filepath);
  };
};
