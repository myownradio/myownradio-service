import { toMillis } from "@myownradio/common/date"
import { decodeId, encodeId } from "@myownradio/common/ids"
import { IAudioTracksEntity, IPlayingChannelsEntity, IRadioChannelsEntity } from "@myownradio/entities/db"
import * as knex from "knex"
import { Context, Middleware } from "koa"
import { TimeService } from "../../time"

export default function getNowPlaying(knexConnection: knex, timeService: TimeService): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channelId = decodeId(encodedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const channel = await knexConnection<IRadioChannelsEntity>("radio_channels")
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const playingChannel = await knexConnection<IPlayingChannelsEntity>("playing_channels")
      .where({ channel_id: channel.id })
      .first()

    if (!playingChannel || playingChannel.paused_at !== null) {
      ctx.throw(409)
    }

    const channelAudioTracks = await knexConnection<IAudioTracksEntity>("audio_tracks")
      .where({ channel_id: channel.id })
      .orderBy("order_id", "asc")

    const now = timeService.now()
    const playlistDuration = channelAudioTracks.reduce((acc, t) => acc + +t.duration, 0)
    const playlistPosition = (now - toMillis(playingChannel.started_at)) % playlistDuration

    let currentOffset = 0
    for (const track of channelAudioTracks) {
      if (currentOffset <= playlistPosition && currentOffset + +track.duration > playlistPosition) {
        ctx.body = {
          track_id: encodeId(track.id),
          offset: playlistPosition - currentOffset,
        }
        ctx.status = 200
        return
      }
      currentOffset += +track.duration
    }

    ctx.status = 204
  }
}
