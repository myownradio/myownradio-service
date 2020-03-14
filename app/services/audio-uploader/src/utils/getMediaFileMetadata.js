const { path: ffprobePath } = require("ffprobe-static");
const fluent = require("fluent-ffmpeg");

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
module.exports = function getMediaFileMetadata(filepath) {
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
};
