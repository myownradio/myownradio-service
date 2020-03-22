module.exports = function createForgotTokenRouteHandler(config, knexConnection) {
  return async ctx => {
    const { refresh_token } = ctx.request.body;

    if (!refresh_token) {
      ctx.throw(400);
    }

    const deletedRows = await knexConnection("refresh_tokens")
      .where({ refresh_token })
      .delete()
      .count();

    if (deletedRows === 0) {
      ctx.throw(401);
    }

    ctx.status = 200;
  };
};
