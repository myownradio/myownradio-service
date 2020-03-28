const os = require("os");

class Config {
  /**
   * @param env {{
   *   PORT?: string,
   *   AUDIO_UPLOADER_ROOT_DIR?: string,
   *   AUDIO_UPLOADER_TOKEN_SECRET?: string,
   *   AUDIO_UPLOADER_METADATA_SECRET?: string,
   *   AUDIO_UPLOADER_TEMP_DIR?: string,
   *   AUDIO_UPLOADER_ALLOWED_ORIGIN?: string,
   * }}
   */
  constructor(env) {
    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080;

    if (!env.AUDIO_UPLOADER_ROOT_DIR) {
      throw new Error("Environment variable AUDIO_UPLOADER_ROOT_DIR is required");
    }

    this.rootDir = env.AUDIO_UPLOADER_ROOT_DIR;

    if (!env.AUDIO_UPLOADER_TOKEN_SECRET) {
      throw new Error("Environment variable AUDIO_UPLOADER_TOKEN_SECRET is required");
    }

    this.tokenSecret = env.AUDIO_UPLOADER_TOKEN_SECRET;

    if (!env.AUDIO_UPLOADER_METADATA_SECRET) {
      throw new Error("Environment variable AUDIO_UPLOADER_METADATA_SECRET is required");
    }

    this.metadataSecret = env.AUDIO_UPLOADER_METADATA_SECRET;

    this.tempDir = env.AUDIO_UPLOADER_TEMP_DIR || os.tmpdir();

    if (!env.AUDIO_UPLOADER_ALLOWED_ORIGIN) {
      throw new Error("Environment variable AUDIO_UPLOADER_ALLOWED_ORIGIN is required");
    }

    this.allowedOrigin = env.AUDIO_UPLOADER_ALLOWED_ORIGIN;
  }
}

module.exports = { Config };
