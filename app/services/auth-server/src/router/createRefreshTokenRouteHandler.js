const errorConstants = require("@myownradio/independent/constants/error");
const generateTokenForUser = require("../utils/generateTokenForUser");
const hasUpdatedRows = require("../utils/hasUpdatedRows");
const createAccessToken = require("../utils/createAccessToken");

function calculateExpirationThreshold(config) {
  const thresholdMillis = new Date().getTime() - config.AUTH_SERVER_REFRESH_TOKEN_LIFETIME * 1000;
  return new Date(thresholdMillis).toISOString();
}

module.exports = function createRefreshTokenRouteHandler(config, knexConnection) {
  return async ctx => {
    const { refresh_token: oldRefreshToken } = ctx.request.body;

    if (!oldRefreshToken) {
      ctx.throw(400, errorConstants.REFRESH_TOKEN_REQUIRED);
    }

    const newRefreshToken = await generateTokenForUser();
    const now = new Date().toISOString();

    const newAccessToken = await knexConnection.transaction(async trx => {
      const threshold = calculateExpirationThreshold(config);

      const updatedRows = await trx("refresh_tokens")
        .update({ refresh_token: newRefreshToken, updated_at: now })
        .where("updated_at", ">", threshold)
        .where({ refresh_token: oldRefreshToken })
        .returning("*");

      if (!hasUpdatedRows(updatedRows)) {
        ctx.throw(401, errorConstants.INVALID_REFRESH_TOKEN);
      }

      const updatedRow = await trx("refresh_tokens")
        .where({ refresh_token: newRefreshToken })
        .first();

      return createAccessToken(
        config.AUTH_SERVER_TOKEN_SECRET,
        config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
        updatedRow.user_id,
      );
    });

    ctx.body = {
      refresh_token: newRefreshToken,
      access_token: newAccessToken,
    };
  };
};
