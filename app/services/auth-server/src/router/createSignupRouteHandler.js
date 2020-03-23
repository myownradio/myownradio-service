const bcrypt = require("bcryptjs");
const { validate: isValidEmail } = require("email-validator");

module.exports = function createSignupRouteHandler(config, knexConnection) {
  return async ctx => {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.throw(400);
    }

    if (password.length < 6) {
      ctx.throw(400);
    }

    if (!isValidEmail(email)) {
      ctx.throw(400);
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
        ctx.status = 409;
      } else {
        throw e;
      }
    }
  };
};
