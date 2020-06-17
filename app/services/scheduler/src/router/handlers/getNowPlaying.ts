import { dateUtils, hashUtils } from "@myownradio/shared-server"
import {
  IAudioTracksEntity as AudioTracksEntity,
  IRadioChannelsEntity as RadioChannelsEntity,
  IPlayingChannelsEntity as PlayingChannelsEntity,
  TableName,
} from "@myownradio/shared-server/lib/entities"
import { TypedContext } from "@myownradio/shared-server/lib/koa/types"
import { NowPlayingResource } from "@myownradio/shared-types"
import * as knex from "knex"
import { Middleware } from "koa"
import { TimeService } from "../../time"

function calculateCurrentTrackIndexAndOffset(
  playlistPosition: number,
  channelAudioTracks: AudioTracksEntity[],
): null | { offset: number; index: number } {
  let currentOffset = 0
  for (const [index, track] of channelAudioTracks.entries()) {
    if (currentOffset <= playlistPosition && currentOffset + +track.duration > playlistPosition) {
      return { index, offset: playlistPosition - currentOffset }
    }
    currentOffset += +track.duration
  }
  return null
}

function calculateNextTrackIndex(currentTrackIndex: number, channelAudioTracks: AudioTracksEntity[]): number {
  // if current track is last in playlist
  if (currentTrackIndex === channelAudioTracks.length - 1) {
    return 0
  }

  return currentTrackIndex + 1
}

export default function getNowPlaying(knexConnection: knex, timeService: TimeService): Middleware {
  return async (ctx: TypedContext<NowPlayingResource>): Promise<void> => {
    const userId = ctx.state.user.uid
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      ctx.throw(404)
      return
    }

    const channel = await knexConnection<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
      return
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const playingChannel = await knexConnection<PlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ channel_id: channel.id })
      .first()

    if (!playingChannel || playingChannel.paused_at !== null) {
      ctx.throw(404)
      return
    }

    // todo get now playing information from redis cache. it would be more accurate when stream will be streaming.

    const channelAudioTracks = await knexConnection<AudioTracksEntity>(TableName.AudioTracks)
      .where({ channel_id: channel.id })
      .orderBy("order_id", "asc")

    const now = timeService.now()

    const playlistDuration = channelAudioTracks.reduce((acc, t) => acc + +t.duration, 0)
    const playlistPosition = (now - dateUtils.convertDateToMillis(playingChannel.started_at)) % playlistDuration

    const probablyIndexAndOffset = calculateCurrentTrackIndexAndOffset(playlistPosition, channelAudioTracks)

    if (!probablyIndexAndOffset) {
      ctx.status = 204
      return
    }

    const nextTrackIndex = calculateNextTrackIndex(probablyIndexAndOffset.index, channelAudioTracks)

    const currentTrack = channelAudioTracks[probablyIndexAndOffset.index]
    const nextTrack = channelAudioTracks[nextTrackIndex]

    // todo add currect urls
    ctx.body = {
      position: probablyIndexAndOffset.index,
      current: {
        id: hashUtils.encodeId(currentTrack.id),
        offset: probablyIndexAndOffset.offset,
        title: `${currentTrack.artist} - ${currentTrack.title}`,
        url: "todo",
      },
      next: {
        id: hashUtils.encodeId(nextTrack.id),
        title: `${nextTrack.artist} - ${nextTrack.title}`,
        url: "todo",
      },
    }
  }
}
