import { decodeId, encodeId } from "@myownradio/common/ids"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { TimeService } from "../../time"
import { assertOwnChannel } from "./utils/assertOwnChannel"

export default function getNowPlaying(knexConnection: knex, timeService: TimeService): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channel = await assertOwnChannel(ctx, knexConnection, userId, decodeId(encodedChannelId))

    const playingChannel = await knexConnection("playing_channels")
      .where({ channel_id: channel.id })
      .first()

    if (!playingChannel || playingChannel.paused_at !== null) {
      ctx.throw(409)
    }

    const channelAudioTracks = await knexConnection("audio_tracks")
      .where({ channel_id: channel.id })
      .orderBy("order_id", "asc")

    const now = timeService.now()
    const playlistDuration = channelAudioTracks.reduce((acc, t) => acc + t.duration, 0)
    const playlistPosition = (now - playingChannel.started_at) % playlistDuration

    let currentOffset = 0
    for (const track of channelAudioTracks) {
      if (currentOffset <= playlistPosition && currentOffset + track.duration > playlistPosition) {
        ctx.body = {
          track_id: encodeId(track.id),
          offset: playlistPosition - currentOffset,
        }
        ctx.status = 200
        return
      }
      currentOffset += track.duration
    }

    ctx.status = 204
  }
}
