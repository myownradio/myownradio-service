const errorConstants = require("@myownradio/independent/constants/error");

module.exports = function createAuthRouteHandler(config, knexConnection) {
  return async ctx => {
    const { uid } = ctx.state.user;
    const userDetails = await knexConnection("users")
      .where({ id: uid })
      .first();

    if (!userDetails) {
      ctx.throw(401, errorConstants.UNAUTHORIZED);
    }

    ctx.set("User-Id", userDetails.id);

    ctx.status = 200;
  };
};
