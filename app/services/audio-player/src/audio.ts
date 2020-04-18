import { Readable, PassThrough } from "stream";
import * as ffmpegPath from "ffmpeg-static";
import * as ff from "fluent-ffmpeg";

const PREVIEW_AUDIO_FORMAT = "mp3";
const MP3_PREVIEW_CHANNELS = 2;
const MP3_PREVIEW_BITRATE = 128000;

export function makeMp3Preview(audioFileUrl: string): Readable {
  const output = new PassThrough();
  ff(audioFileUrl)
    .setFfmpegPath(ffmpegPath)
    .withNativeFramerate()
    .withOutputFormat(PREVIEW_AUDIO_FORMAT)
    .withAudioChannels(MP3_PREVIEW_CHANNELS)
    .withAudioBitrate(MP3_PREVIEW_BITRATE)
    .writeToStream(output, { end: true });
  return output;
}

export function isMp3Header(buf: Buffer): boolean {
  if (!buf || buf.length < 3) {
    return false;
  }
  return (buf[0] === 73 && buf[1] === 68 && buf[2] === 51) || (buf[0] === 255 && (buf[1] === 251 || buf[1] === 250));
}
