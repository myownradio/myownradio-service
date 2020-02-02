const { exists, unlink } = require("fs");
const { promisify } = require('util');
const path = require("path");

const config = require("../config");

const existsAsync = promisify(exists);
const unlinkAsync = promisify(unlink);

module.exports = async function del(ctx) {
  const filepath = path.join(config.contentDir, ctx.request.path);

  if (!(await existsAsync(filepath))) {
    ctx.throw(404);
  }

  await unlinkAsync(filepath);
};
