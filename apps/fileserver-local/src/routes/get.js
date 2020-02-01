const path = require("path");
const download = require("../helpers/download");

const config = require("../config");

module.exports = async function get(ctx) {
  const filepath = path.join(config.contentDir, ctx.request.path);
  await download(ctx, filepath);
};
