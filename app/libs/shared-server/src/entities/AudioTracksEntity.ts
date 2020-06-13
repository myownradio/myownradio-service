import * as t from "io-ts";

export const AudioTracksEntityContract = t.interface({
  bitrate: t.number, // integer nullable: NO
  user_id: t.number, // integer nullable: NO
  genre: t.string, // character varying nullable: NO
  duration: t.string, // numeric nullable: NO
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  hash: t.string, // character varying nullable: NO
  format: t.string, // character varying nullable: NO
  size: t.number, // integer nullable: NO
  title: t.string, // character varying nullable: NO
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  channel_id: t.number, // integer nullable: NO
  artist: t.string, // character varying nullable: NO
  album: t.string, // character varying nullable: NO
  name: t.string, // character varying nullable: NO
  order_id: t.number, // integer nullable: NO
  id: t.number, // integer nullable: NO
});

export type IAudioTracksEntity = t.TypeOf<typeof AudioTracksEntityContract>;
