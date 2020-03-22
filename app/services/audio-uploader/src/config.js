const os = require("os");

const { assert } = require("@myownradio/shared");

const {
  AUDIO_UPLOADER_ROOT_FOLDER,
  AUDIO_UPLOADER_TOKEN_SECRET,
  AUDIO_UPLOADER_TEMP_DIR = os.tmpdir(),
  PORT,
} = process.env;

const config = {
  AUDIO_UPLOADER_ROOT_FOLDER,
  AUDIO_UPLOADER_TOKEN_SECRET,
  AUDIO_UPLOADER_TEMP_DIR,
  PORT,
};

assert(typeof config.PORT === "string");
assert(typeof config.AUDIO_UPLOADER_ROOT_FOLDER === "string");
assert(typeof config.AUDIO_UPLOADER_TOKEN_SECRET === "string");
assert(typeof config.AUDIO_UPLOADER_TEMP_DIR === "string");

module.exports = config;
