import * as t from "io-ts";

export const PlayingChannelsEntityContract = t.interface({
  channel_id: t.number, // integer nullable: NO
  paused_at: t.union([t.null, t.number]), // integer nullable: YES
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  start_offset: t.number, // integer nullable: NO
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  started_at: t.number, // integer nullable: NO
  id: t.number, // integer nullable: NO
});

export type IPlayingChannelsEntity = t.TypeOf<typeof PlayingChannelsEntityContract>;

export enum PlayingChannelsProps {
  ChannelId = "channel_id",
  PausedAt = "paused_at",
  CreatedAt = "created_at",
  StartOffset = "start_offset",
  UpdatedAt = "updated_at",
  StartedAt = "started_at",
  Id = "id",
}
