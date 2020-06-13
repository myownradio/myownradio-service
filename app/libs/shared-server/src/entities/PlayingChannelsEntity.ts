import * as t from "io-ts";

export const PlayingChannelsEntityContract = t.interface({
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  start_offset: t.number, // integer nullable: NO
  id: t.number, // integer nullable: NO
  started_at: t.string, // timestamp with time zone nullable: NO
  channel_id: t.number, // integer nullable: NO
  paused_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
});

export type IPlayingChannelsEntity = t.TypeOf<typeof PlayingChannelsEntityContract>;

export enum PlayingChannelsProps {
  CreatedAt = "created_at",
  UpdatedAt = "updated_at",
  StartOffset = "start_offset",
  Id = "id",
  StartedAt = "started_at",
  ChannelId = "channel_id",
  PausedAt = "paused_at",
}
