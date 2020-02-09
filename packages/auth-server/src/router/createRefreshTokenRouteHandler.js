const generateTokenForUser = require("../utils/generateTokenForUser");
const hasUpdatedRows = require("../utils/hasUpdatedRows");
const createAccessToken = require("../utils/createAccessToken");

module.exports = function createRefreshTokenRouteHandler(
  config,
  knexConnection
) {
  return async ctx => {
    const { refresh_token: oldRefreshToken } = ctx.request.body;

    if (!oldRefreshToken) {
      ctx.throw(400, "Refresh token should be specified");
    }

    const newRefreshToken = await generateTokenForUser();
    const now = new Date().toISOString();

    const newAccessToken = await knexConnection.transaction(async trx => {
      const updatedRows = await trx("refresh_tokens")
        .update({ refresh_token: newRefreshToken, updated_at: now })
        .where({ refresh_token: oldRefreshToken })
        .returning("*");

      if (!hasUpdatedRows(updatedRows)) {
        ctx.throw(401);
      }

      const updatedRow = await trx("refresh_tokens")
        .select("user_id")
        .where({ refresh_token: newRefreshToken })
        .first();

      return createAccessToken(
        config.AUTH_SERVER_TOKEN_SECRET,
        config.AUTH_SERVER_ACCESS_TOKEN_LIFETIME,
        updatedRow.user_id
      );
    });

    ctx.body = {
      refresh_token: newRefreshToken,
      access_token: newAccessToken
    };
  };
};
