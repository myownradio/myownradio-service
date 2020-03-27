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
            duration: metadata.format.duration,
            bitrate: metadata.format.bit_rate,
            format: metadata.format.format_long_name,
            artist: metadata.format.tags.artist,
            title: metadata.format.tags.title,
            album: metadata.format.tags.album,
            genre: metadata.format.tags.genre,
          });
        }
      });
  });
}

module.exports = { hashToPath, fileExists, getMediaFileMetadata };
