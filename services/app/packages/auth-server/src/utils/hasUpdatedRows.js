/**
 * @param {Array|number} updatedRows
 * @return {boolean}
 */
module.exports = function hasUpdatedRows(updatedRows) {
  if (typeof updatedRows === "number") {
    return updatedRows > 0;
  }
  if (Array.isArray(updatedRows)) {
    return updatedRows.length > 0;
  }
  throw new TypeError(`Unknown type of updated rows`);
};
