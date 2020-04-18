const createAccessToken = require("../utils/createAccessToken");

function calculateExpirationThreshold(config) {
  const thresholdMillis = new Date().getTime() - config.AUTH_SERVER_REFRESH_TOKEN_LIFETIME * 1000;
  return new Date(thresholdMillis).toISOString();
}

module.exports = function createIssueNewAccessTokenRouteHandler(config, knexConnection) {
  return async ctx => {
    const { refresh_token: refreshToken } = ctx.request.body;

    if (!refreshToken) {
      ctx.throw(400);
    }

    const now = new Date().toISOString();

    const newAccessToken = await knexConnection.transaction(async trx => {
      const threshold = calculateExpirationThreshold(config);

      const foundRow = await trx("refresh_tokens")
        .where("updated_at", ">", threshold)
        .where({ refresh_token: refreshToken })
        .first();

      if (!foundRow) {
        ctx.throw(401);
      }

      return createAccessToken(
        config.AUTH_SERVER_TOKEN_SECRET,
        config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
        foundRow.user_id,
      );
    });

    ctx.body = {
      access_token: newAccessToken,
    };
  };
};
