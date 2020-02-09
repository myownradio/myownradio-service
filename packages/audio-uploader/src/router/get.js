const path = require("path");
const { fileExists } = require("@myownradio/shared").fsHelpers;
const { download } = require("@myownradio/shared").koaHelpers;

module.exports = function createGetHandler(config) {
  return async ctx => {
    const filepath = path.join(
      config.AUDIO_UPLOADER_ROOT_FOLDER,
      ctx.request.path
    );

    if (!(await fileExists(filepath))) {
      return;
    }

    await download(ctx, filepath);
  };
};
