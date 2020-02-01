module.exports = function verifyTokenAction(action) {
  return (ctx, next) => {
    const { action: tokenAction = "void" } = ctx.state.tokenData;
    if (tokenAction === action) {
      return next();
    }
    throw new TypeError(
      `Token issued for action: ${tokenAction}, but required: ${action}`
    );
  };
};
