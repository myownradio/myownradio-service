import * as t from "io-ts"

export const PlayingChannelsEntityContract = t.interface({
  updated_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  start_offset: t.number, // integer nullable: NO
  id: t.number, // integer nullable: NO
  started_at: t.string, // timestamp with time zone nullable: NO
  created_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  paused_at: t.union([t.null, t.string]), // timestamp with time zone nullable: YES
  channel_id: t.number, // integer nullable: NO
})

export type IPlayingChannelsEntity = t.TypeOf<typeof PlayingChannelsEntityContract>

export enum PlayingChannelsProps {
  UpdatedAt = "updated_at",
  StartOffset = "start_offset",
  Id = "id",
  StartedAt = "started_at",
  CreatedAt = "created_at",
  PausedAt = "paused_at",
  ChannelId = "channel_id",
}
