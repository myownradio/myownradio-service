class InvariantError extends Error {}

/**
 * Throws InvariantError if assertion is falsy.
 *
 * @param {boolean} assertion
 */
module.exports = function assert(assertion) {
  if (!assertion) {
    throw new InvariantError("Invariant error");
  }
};
