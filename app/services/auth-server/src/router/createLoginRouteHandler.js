const bcrypt = require("bcryptjs");

const createAccessToken = require("../utils/createAccessToken");
const generateTokenForUser = require("../utils/generateTokenForUser");

module.exports = function createIndexRouteHandler(config, knexConnection) {
  return async ctx => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.throw(400);
    }

    const user = await knexConnection("users")
      .where({ email })
      .first();

    if (!user) {
      ctx.throw(401);
    }

    const arePasswordsEqual = await bcrypt.compare(password, user.password);

    if (!arePasswordsEqual) {
      ctx.throw(401);
    }

    const refreshToken = await generateTokenForUser();
    const now = new Date().toISOString();

    await knexConnection("refresh_tokens").insert({
      user_id: user.id,
      refresh_token: refreshToken,
      created_at: now,
      updated_at: now,
    });

    const accessToken = await createAccessToken(
      config.AUTH_SERVER_TOKEN_SECRET,
      config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
      user.id,
    );

    ctx.body = {
      refresh_token: refreshToken,
      access_token: accessToken,
    };
  };
};
