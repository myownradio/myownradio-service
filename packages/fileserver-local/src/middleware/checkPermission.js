const idx = require("idx");

module.exports = function checkPermission(permission) {
  return (ctx, next) => {
    if (idx(ctx.state, it => it.user.perm).includes(permission)) {
      return next();
    }

    ctx.throw(400, `Token does not have required permission: ${permission}`);
  };
};
