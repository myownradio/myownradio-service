const { verify } = require('jsonwebtoken');
const { promisify } = require("util");

const verifyAsync = promisify(verify);

const config = require("../config");

module.exports = async function readToken(ctx, next) {
  const token = ctx.get('token');
  ctx.state.tokenData = await verifyAsync(token, config.tokenSecret);;
  await next();
};
