/**
 * @typedef {{
 *    get: Function,
 *    set: Function,
 *    body: ReadStream,
 *    status: number
 * }} KoaContext
 */

const fs = require("fs");
const path = require("path");
const mime = require("mime");

const RANGE_REGEXP = /^bytes=([0-9]+)-$/;

/**
 * Retrieves range start from KoaContext.
 *
 * @param {KoaContext} ctx
 * @returns {number}
 */
function getStartRange(ctx) {
  const range = ctx.get("range");

  let startRange = 0;

  if (range !== undefined && RANGE_REGEXP.test(range)) {
    const [, startRangeString] = RANGE_REGEXP.exec(range);
    startRange = Number(startRangeString);
  }

  return startRange;
}

/**
 * Sends headers to KoaContext.
 *
 * @param {KoaContext} ctx
 * @param {string} filepath
 * @param {number} fileSize
 * @param {number} startRange
 * @returns {void}
 */
function sendHeaders(ctx, filepath, fileSize, startRange) {
  if (startRange === 0) {
    ctx.set("x-transfer-length", fileSize);
    ctx.set("content-length", fileSize);
    ctx.status = 200;
  } else {
    ctx.set("x-transfer-length", fileSize);
    ctx.set("accept-ranges", "bytes");
    ctx.set("content-range", `bytes ${startRange}-${fileSize - 1}/${fileSize}`);
    ctx.status = 206;
  }

  const filename = path.basename(filepath);

  ctx.set("content-type", mime.getType(filepath));
  ctx.set("content-disposition", `attachment; filename=${filename}`);
}

/**
 *
 * @param {KoaContext} ctx
 * @param {string} filepath
 * @param {number} startRange
 * @return {void}
 */
function sendData(ctx, filepath, startRange) {
  ctx.body = fs.createReadStream(filepath, {
    start: startRange
  });
}

/**
 * Sends local file to KoaContext with support of range requests.
 *
 * @param {KoaContext} ctx
 * @param {string} filepath
 * @returns {Promise<void>}
 */
module.exports = async function download(ctx, filepath) {
  const startRange = getStartRange(ctx);
  const fileStat = await fs.promises.stat(filepath);

  sendHeaders(ctx, filepath, fileStat.size, startRange);
  sendData(ctx, filepath, startRange);
};
