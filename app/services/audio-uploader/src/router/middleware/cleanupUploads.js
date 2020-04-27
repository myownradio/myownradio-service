const fs = require("fs")

async function cleanupUploads(ctx, next) {
  try {
    await next()
  } finally {
    if (ctx.request.files) {
      const tempFiles = Object.values(ctx.request.files).map(file => file.path)
      await Promise.all(tempFiles.map(tmpFile => fs.promises.unlink(tmpFile)))
    }
  }
}

module.exports = cleanupUploads
