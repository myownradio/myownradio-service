import * as t from "io-ts"

export const AudioTracksEntityContract = t.interface({
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  hash: t.string, // character varying nullable: NO
  format: t.string, // character varying nullable: NO
  bitrate: t.number, // integer nullable: NO
  user_id: t.number, // integer nullable: NO
  genre: t.string, // character varying nullable: NO
  duration: t.string, // numeric nullable: NO
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  channel_id: t.number, // integer nullable: NO
  artist: t.string, // character varying nullable: NO
  album: t.string, // character varying nullable: NO
  name: t.string, // character varying nullable: NO
  order_id: t.number, // integer nullable: NO
  id: t.number, // integer nullable: NO
  size: t.number, // integer nullable: NO
  title: t.string, // character varying nullable: NO
})

export type IAudioTracksEntity = t.TypeOf<typeof AudioTracksEntityContract>

export enum AudioTracksProps {
  UpdatedAt = "updated_at",
  Hash = "hash",
  Format = "format",
  Bitrate = "bitrate",
  UserId = "user_id",
  Genre = "genre",
  Duration = "duration",
  CreatedAt = "created_at",
  ChannelId = "channel_id",
  Artist = "artist",
  Album = "album",
  Name = "name",
  OrderId = "order_id",
  Id = "id",
  Size = "size",
  Title = "title",
}
