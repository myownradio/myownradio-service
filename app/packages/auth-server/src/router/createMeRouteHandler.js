const errorConstants = require("@myownradio/independent/constants/error");

module.exports = function createMeTokenRouteHandler(config, knexConnection) {
  return async ctx => {
    const { uid } = ctx.state.user;
    const userDetails = await knexConnection("users")
      .where({ id: uid })
      .first();

    if (!userDetails) {
      ctx.throw(401, errorConstants.UNAUTHORIZED);
    }

    ctx.body = {
      id: userDetails.id,
      email: userDetails.email
    };
  };
};
