const { stat, createReadStream } = require("fs");
const { promisify } = require("util");
const { basename } = require("path");
const { getType } = require('mime');

const statAsync = promisify(stat);

const RANGE_REGEXP = /^bytes=([0-9]+)-$/;

function getStartRange(ctx) {
  const range = ctx.get("range");

  let startRange = 0;

  if (range !== undefined && RANGE_REGEXP.test(range)) {
    const [, startRangeString] = RANGE_REGEXP.exec(range);
    startRange = Number(startRangeString);
  }

  return startRange;
}

async function sendHeaders(filepath, startRange, ctx) {
  const fileStat = await statAsync(filepath);

  if (startRange === 0) {
    ctx.set("x-transfer-length", fileStat.size);
    ctx.set("content-length", fileStat.size);
    ctx.status = 200;
  } else {
    ctx.set("x-transfer-length", fileStat.size);
    ctx.set("accept-ranges", "bytes");
    ctx.set(
      "content-range",
      `bytes ${  startRange  }-${  fileStat.size - 1  }/${  fileStat.size}`
    );
    ctx.status = 206;
  }

  const filename = basename(filepath);

  ctx.set('content-type', getType(filepath));
  ctx.set("content-disposition", `attachment; filename=${filename}`);
}

function sendData(ctx, filepath, startRange) {
  ctx.body = createReadStream(filepath, {
    start: startRange
  });
}

module.exports = async function download(ctx, filepath) {
  const startRange = getStartRange(ctx);
  await sendHeaders(filepath, startRange, ctx);
  sendData(ctx, filepath, startRange);
};
