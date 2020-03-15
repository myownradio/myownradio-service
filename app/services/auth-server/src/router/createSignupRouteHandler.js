const errorConstants = require("@myownradio/independent/constants/error");
const bcrypt = require("bcryptjs");

module.exports = function createSignupRouteHandler(config, knexConnection) {
  return async ctx => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.throw(400, errorConstants.EMAIL_AND_PASSWORD_REQUIRED);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    try {
      await knexConnection("users").insert({
        email,
        password: passwordHash,
        created_at: now,
        updated_at: now,
      });

      ctx.status = 200;
    } catch (e) {
      if (e.message.match(/constraint/)) {
        ctx.body = errorConstants.EMAIL_ALREADY_IN_USE;
        ctx.status = 400;
      } else {
        throw e;
      }
    }
  };
};
