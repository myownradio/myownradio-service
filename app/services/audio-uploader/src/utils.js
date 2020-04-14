const { createHmac } = require("crypto");
const fs = require("fs");
const path = require("path");

const { path: ffprobePath } = require("ffprobe-static");
const fluent = require("fluent-ffmpeg");

/**
 * Converts hash to path with sub directories.
 *
 * @param {string} hash
 * @return {string}
 */
function hashToPath(hash) {
  const parts = [hash.slice(0, 1), hash.slice(1, 2), hash];
  return parts.join(path.sep);
}

/**
 * Checks whether file exists.
 *
 * @param {string} path
 * @return {Promise<boolean>}
 */
async function fileExists(path) {
  return fs.promises.access(path, fs.constants.F_OK).then(
    () => true,
    () => false,
  );
}

/**
 * Creates hmac digest using sha256 algorithm.
 *
 * @param data
 * @param secret
 * @return {string}
 */
function createHmacDigest(data, secret) {
  return createHmac("sha256", secret)
    .update(data)
    .digest("hex");
}

/**
 * Generates signature for provided metadata.
 *
 * @param rawMetadata {string}
 * @param secret {string}
 * @return {string}
 */
function createSignatureForMetadata(rawMetadata, secret) {
  const signedAt = Date.now();
  const payload = `${signedAt}.${rawMetadata}`;
  const hmacDigest = createHmacDigest(payload, secret);
  return Buffer.from(`${signedAt}.${hmacDigest}`).toString("base64");
}

/**
 * Validates that signature of provided metadata is correct and is not expired.
 *
 * @param rawMetadata {string}
 * @param signature {string}
 * @param secret {string}
 * @param ttl {number}
 * @return {boolean}
 */
function verifySignatureOfMetadata(rawMetadata, signature, secret, ttl) {
  const decodedSignature = Buffer.from(signature, "base64").toString();
  const [extractedSignedAt, extractedHmacDigest] = decodedSignature.split(".", 2);
  const payload = `${extractedSignedAt}.${rawMetadata}`;
  const hmacDigest = createHmacDigest(payload, secret);

  if (extractedHmacDigest !== hmacDigest) {
    return false;
  }

  return Date.now() < extractedSignedAt + ttl;
}

/**
 * @typedef {{
 *  duration: number
 *  bitrate: number
 *  format: string
 *  artist: string
 *  title: string
 *  album: string
 *  genre: string
 * }} Metadata
 */

/**
 * Gets metadata from media file.
 *
 * @param {string} filepath
 * @return {Promise<Metadata>}
 */
function getMediaFileMetadata(filepath) {
  return new Promise((resolve, reject) => {
    fluent(filepath)
      .setFfprobePath(ffprobePath)
      .ffprobe((err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            duration: metadata.format.duration * 1000,
            bitrate: metadata.format.bit_rate,
            format: metadata.format.format_long_name || "Unknown audio format",
            artist: (metadata.format.tags || {}).artist || "",
            title: (metadata.format.tags || {}).title || "",
            album: (metadata.format.tags || {}).album || "",
            genre: (metadata.format.tags || {}).genre || "",
          });
        }
      });
  });
}

module.exports = {
  hashToPath,
  fileExists,
  getMediaFileMetadata,
  createSignatureForMetadata,
  verifySignatureOfMetadata,
};
