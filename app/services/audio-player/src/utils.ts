import { Writable } from "stream";
import * as ffmpegPath from "ffmpeg-static";
import * as ff from "fluent-ffmpeg";

// todo think about better name and implementation
export function createPreviewStream(filename: string, writableStream: Writable): void {
  ff(filename)
    .setFfmpegPath(ffmpegPath)
    .writeToStream(writableStream, { end: true });
}
