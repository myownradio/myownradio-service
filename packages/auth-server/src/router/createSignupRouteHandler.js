const bcrypt = require("bcryptjs");

module.exports = function createSignupRouteHandler(config, knexConnection) {
  return async ctx => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.throw(
        400,
        'Both "email" and "password" parameters should be specified'
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    try {
      await knexConnection("users").insert({
        email,
        password: passwordHash,
        created_at: now,
        updated_at: now
      });

      ctx.status = 200;
    } catch (e) {
      if (e.message.match(/constraint/)) {
        ctx.body = "Given email already used by someone else";
      } else {
        ctx.body = e.message;
      }
      ctx.status = 400;
    }
  };
};
