/**
 * Creates from given constants object where keys are equal to their values.
 *
 * @param {string} constants
 * @return {object}
 */
module.exports = function enumerate(...constants) {
  const reducer = (acc, constant) => {
    acc[constant] = constant;
    return acc;
  };

  return constants.reduce(reducer, {});
};
