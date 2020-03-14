const bcrypt = require("bcryptjs");
const errorConstants = require("@myownradio/independent/constants/error");
const createAccessToken = require("../utils/createAccessToken");
const generateTokenForUser = require("../utils/generateTokenForUser");

module.exports = function createIndexRouteHandler(config, knexConnection) {
  return async ctx => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.throw(400, errorConstants.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const user = await knexConnection("users")
      .where({ email })
      .first();

    if (!user) {
      ctx.throw(401, errorConstants.WRONG_EMAIL_OR_PASSWORD);
    }

    const passwordsAreEqual = await bcrypt.compare(password, user.password);

    if (!passwordsAreEqual) {
      ctx.throw(401, errorConstants.WRONG_EMAIL_OR_PASSWORD);
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
      id: user.id,
      email,
      refresh_token: refreshToken,
      access_token: accessToken,
    };
  };
};
