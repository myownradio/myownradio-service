import { dateUtils, hashUtils } from "@myownradio/shared-server"
import {
  AudioTracksProps,
  IAudioTracksEntity as AudioTracksEntity,
  IPlayingChannelsEntity as PlayingChannelsEntity,
  PlayingChannelsProps,
  TableName,
} from "@myownradio/shared-server/lib/entities"
import { Container } from "inversify"
import { Context, Middleware } from "koa"
import { KnexType, TimeServiceType } from "../di/types"
import { KnexConnection } from "../interfaces"
import { TimeService } from "../time"
import { calcTrackIndexAndOffset, withOffset } from "../utils"

/**
 * This middleware restores radio channel's now playing position after playlist updated.
 */
export function syncRadioChannelMiddleware(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const timeService = container.get<TimeService>(TimeServiceType)

  return async (ctx: Context, next: () => PromiseLike<void>): Promise<void> => {
    const { channelId: hashedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(hashedChannelId)

    if (!channelId) {
      // If middleware can't decode hashed channelId we just return control
      // to route handler.
      return next()
    }

    const playingChannel = await knex<PlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ channel_id: channelId })
      .first()

    if (!playingChannel) {
      // Looks like this channel isn't playing now. So position correction
      // isn't needed and we just return control to route handler.
      return next()
    }

    const tracks = await knex<AudioTracksEntity>(TableName.AudioTracks)
      .where({ channel_id: channelId })
      .orderBy(AudioTracksProps.OrderId, "asc")
    const duration = tracks.reduce((acc, t) => acc + +t.duration, 0)
    const tracksWithOffset = withOffset(tracks)

    const now = timeService.now()
    const position = (now - dateUtils.convertDateToMillis(playingChannel.started_at)) % duration
    const trackIndexAndOffset = calcTrackIndexAndOffset(position, tracks)

    if (!trackIndexAndOffset) {
      // This will never happen, but if it happened we return control to route handler.
      return next()
    }

    // We need to know current track and it's offset in playlist before handling user request.
    const trackWithOffset = tracksWithOffset[trackIndexAndOffset.index]

    // Handle user request, that could alter current
    await next()

    const tracksAfterHandle = await knex<AudioTracksEntity>(TableName.AudioTracks)
      .where({ channel_id: channelId })
      .orderBy(AudioTracksProps.OrderId, "asc")
    const tracksWithOffsetAfterHandle = withOffset(tracksAfterHandle)

    let resetTrackOffset = false
    let trackIndexAfterHandle = tracksWithOffsetAfterHandle.findIndex(t => t.track.id === trackWithOffset.track.id)

    if (trackIndexAfterHandle === -1) {
      // Probably, user deleted playing track from playlist. In this case we
      // rewind playlist position to the other track with same order_id.
      trackIndexAfterHandle =
        tracksWithOffsetAfterHandle.findIndex(t => t.track.order_id === trackWithOffset.track.order_id) ?? 0
      resetTrackOffset = true
    }

    if (trackIndexAfterHandle === -1) {
      // If there is no other track with same order_id we rewind to the first track in playlist.
      trackIndexAfterHandle = 0
      resetTrackOffset = true
    }

    const newTrackWithOffset = tracksWithOffsetAfterHandle[trackIndexAfterHandle]

    let difference = trackWithOffset.offset - newTrackWithOffset.offset

    // This flag means that we want to restart playback from the beginning of the track.
    if (resetTrackOffset) {
      difference -= trackIndexAndOffset.offset
    }

    await knex<PlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ id: playingChannel.id })
      .increment(PlayingChannelsProps.StartedAt, difference)

    if (resetTrackOffset) {
      // todo Broadcast message that playlist forcibly updated.
    }
  }
}
