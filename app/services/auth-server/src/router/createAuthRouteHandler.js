module.exports = function createAuthRouteHandler(config, knexConnection) {
  return async ctx => {
    const { uid } = ctx.state.user
    const userDetails = await knexConnection("users")
      .where({ id: uid })
      .first()

    if (!userDetails) {
      ctx.throw(401)
    }

    ctx.set("User-Id", userDetails.id)

    ctx.status = 200
  }
}
