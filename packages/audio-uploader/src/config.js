const { assert } = require("@myownradio/shared");

const {
  AUDIO_UPLOADER_ROOT_FOLDER,
  AUDIO_UPLOADER_TOKEN_SECRET,
  PORT
} = process.env;

const config = {
  AUDIO_UPLOADER_ROOT_FOLDER,
  AUDIO_UPLOADER_TOKEN_SECRET,
  PORT
};

assert(typeof config.PORT === "string");
assert(typeof config.AUDIO_UPLOADER_ROOT_FOLDER === "string");
assert(typeof config.AUDIO_UPLOADER_TOKEN_SECRET === "string");

module.exports = config;
