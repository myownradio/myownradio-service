import { dateUtils, hashUtils } from "@myownradio/shared-server"
import { convertDateToIso } from "@myownradio/shared-server/lib/dateUtils"
import {
  AudioTracksProps,
  IAudioTracksEntity as AudioTracksEntity,
  IPlayingChannelsEntity as PlayingChannelsEntity,
  PlayingChannelsProps,
  TableName,
} from "@myownradio/shared-server/lib/entities"
import { EventEmitterService } from "@myownradio/shared-types"
import { Container } from "inversify"
import { Context, Middleware } from "koa"
import { EventEmitterType, KnexType, TimeServiceType } from "../di/types"
import { KnexConnection } from "../interfaces"
import { TimeService } from "../time"
import { calcTrackIndexAndTrackPosition, getUserIdFromContext, withOffset } from "../utils"

/**
 * This middleware restores radio channel's now playing position after playlist updated.
 */
export function syncRadioChannelMiddleware(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const timeService = container.get<TimeService>(TimeServiceType)
  const eventEmitter = container.get<EventEmitterService>(EventEmitterType)

  return async (ctx: Context, next: () => PromiseLike<void>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
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
    const trackIndexAndTrackPosition = calcTrackIndexAndTrackPosition(position, tracks)

    if (!trackIndexAndTrackPosition) {
      // This will never happen, but if it happened we return control to route handler.
      return next()
    }

    // We need to know current track and it's trackPosition in playlist before handling user request.
    const trackWithOffset = tracksWithOffset[trackIndexAndTrackPosition.index]

    // Handle user request, that could alter current
    await next()

    const tracksAfterHandle = await knex<AudioTracksEntity>(TableName.AudioTracks)
      .where({ channel_id: channelId })
      .orderBy(AudioTracksProps.OrderId, "asc")

    if (tracksAfterHandle.length === 0) {
      // After handling user request playlist became empty. It means that there's nothing to play
      // and we can stop the channel by removing PlayingChannel entity and broadcasting message
      // about channel state updated.
      await knex<PlayingChannelsEntity>(TableName.PlayingChannels)
        .where({ id: playingChannel.id })
        .delete()
      eventEmitter.emitEvent({ type: "CHANNEL_STATE_UPDATED", userId, channelId })
      return
    }

    const tracksWithOffsetAfterHandle = withOffset(tracksAfterHandle)

    let resetTrackPosition = false
    let trackIndexAfterHandle = tracksWithOffsetAfterHandle.findIndex(t => t.track.id === trackWithOffset.track.id)

    if (trackIndexAfterHandle === -1) {
      // Probably, user deleted playing track from playlist. In this case we
      // rewind playlist position to the other track with same order_id.
      trackIndexAfterHandle = tracksWithOffsetAfterHandle.findIndex(
        t => t.track.order_id === trackWithOffset.track.order_id,
      )
      resetTrackPosition = true
    }

    if (trackIndexAfterHandle === -1) {
      // If there is no other track with same order_id we rewind to the first track in playlist.
      trackIndexAfterHandle = 0
    }

    const newTrackWithOffset = tracksWithOffsetAfterHandle[trackIndexAfterHandle]
    const newTrackPosition = resetTrackPosition ? 0 : trackIndexAndTrackPosition.trackPosition

    // We're computed current playing track in updated playlist, got track position and new time offset.
    // Then we compute and update new value for `started_at` property in current playing radio station.
    await knex<PlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ id: playingChannel.id })
      .update(PlayingChannelsProps.StartedAt, convertDateToIso(now - newTrackWithOffset.offset - newTrackPosition))

    if (resetTrackPosition) {
      // We must acknowledge everyone that after handling user request current track in playlist
      // was removed and we restarted playback with the next track or first track in the playlist.
      eventEmitter.emitEvent({ type: "CHANNEL_STATE_UPDATED", userId, channelId })
    }
  }
}
