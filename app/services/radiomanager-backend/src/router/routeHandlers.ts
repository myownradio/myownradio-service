import { dateUtils, hashUtils } from "@myownradio/shared-server"
import {
  IRadioChannelsEntity as RadioChannelsEntity,
  TableName,
  RadioChannelsProps,
  AudioTracksProps,
  IPlayingChannelsEntity,
  IPlayingChannelsEntity as PlayingChannelsEntity,
  IAudioTracksEntity as AudioTracksEntity,
} from "@myownradio/shared-server/lib/entities"
import { convertFileHashToFileUrl } from "@myownradio/shared-server/lib/pathUtils"
import { AudioTrackResource, RadioChannelResource } from "@myownradio/shared-types"
import { Container } from "inversify"
import * as t from "io-ts"
import { Context, Middleware } from "koa"
import { Config } from "../config"
import { ConfigType, KnexType, TimeServiceType } from "../di/types"
import { KnexConnection, TypedContext } from "../interfaces"
import { decodeT } from "../io"
import { TimeService } from "../time"
import {
  calcTrackIndexAndTrackPosition,
  calcNextTrackIndex,
  getUserIdFromContext,
  verifyMetadataSignature,
} from "../utils"

export function getRadioChannels(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: TypedContext<RadioChannelResource[]>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const channels = await knex
      .from<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ [RadioChannelsProps.UserId]: userId })

    ctx.body = channels.map(channelEntity => ({
      id: hashUtils.encodeId(channelEntity.id),
      title: channelEntity.title,
    }))
  }
}

const CreateChannelRequestContract = t.type({
  title: t.string,
})

export function createRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: TypedContext<RadioChannelResource>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const body = decodeT(CreateChannelRequestContract)(ctx.request.body)

    try {
      const [channelId] = await knex
        .into(TableName.RadioChannels)
        .insert({
          title: body.title,
          user_id: userId,
        })
        .returning("id")

      ctx.body = {
        id: hashUtils.encodeId(channelId),
        title: body.title,
      }
    } catch (e) {
      if (e.message.match(/constraint/)) {
        ctx.status = 401
      } else {
        throw e
      }
    }
  }
}

export function deleteRadioChannel(container: Container): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: hashedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(hashedChannelId)

    void userId
    void channelId
    void container
    // todo stop radio channel if it's playing
    // todo delete radio channel tracks
    // todo delete radio channel
  }
}

export function getRadioChannelTracks(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: TypedContext<AudioTrackResource[]>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: hashedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(hashedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const channel = await knex
      .from(TableName.RadioChannels)
      .where({ [RadioChannelsProps.Id]: channelId })
      .first()

    if (!channel) {
      return
    }

    if (channel.user_id !== userId) {
      return ctx.throw(401)
    }

    const audioTracks = await knex
      .from(TableName.AudioTracks)
      .where(AudioTracksProps.ChannelId, channelId)
      .orderBy(AudioTracksProps.OrderId, "ASC")

    ctx.body = audioTracks.map(audioTrack => ({
      id: hashUtils.encodeId(audioTrack.id),
      name: audioTrack.name,
      artist: audioTrack.artist,
      title: audioTrack.title,
      album: audioTrack.album,
      bitrate: audioTrack.bitrate,
      duration: audioTrack.duration,
      order_id: audioTrack.order_id,
      size: audioTrack.size,
      format: audioTrack.format,
      genre: audioTrack.genre,
    }))
  }
}

const AddTrackToChannelRequestContract = t.type({
  name: t.string,
  hash: t.string,
  size: t.number,
  artist: t.string,
  title: t.string,
  album: t.string,
  genre: t.string,
  bitrate: t.number,
  duration: t.number,
  format: t.string,
})

export function addTrackToRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const config = container.get<Config>(ConfigType)

  return async (ctx: TypedContext<AudioTrackResource>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: hashedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(hashedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const rawMetadata = ctx.request.rawBody
    const signature = ctx.get("signature")
    const body = decodeT(AddTrackToChannelRequestContract)(ctx.request.body)

    if (!verifyMetadataSignature(rawMetadata, signature, config.metadataSecret, config.metadataSignatureTtl)) {
      ctx.throw(400)
    }

    const channel = await knex(TableName.RadioChannels)
      .where({ [RadioChannelsProps.Id]: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const [trackId, orderId] = await knex.transaction(async trx => {
      // todo compensate playing position after track added

      const countQueryResult = await trx(TableName.AudioTracks)
        .where({ [AudioTracksProps.ChannelId]: channelId })
        .count<[{ count: string }]>("id as count")

      const count = +countQueryResult[0]["count"]
      const nextOrderId = count + 1

      const [trackId] = await trx(TableName.AudioTracks)
        .insert({
          channel_id: channelId,
          user_id: userId,
          name: body.name,
          hash: body.hash,
          size: body.size,
          artist: body.artist,
          title: body.title,
          album: body.album,
          genre: body.genre,
          bitrate: body.bitrate,
          duration: body.duration,
          format: body.format,
          order_id: nextOrderId,
        })
        .returning("id")

      return [trackId, nextOrderId]
    })

    ctx.body = {
      id: hashUtils.encodeId(trackId),
      name: body.name,
      artist: body.artist,
      title: body.title,
      album: body.album,
      bitrate: body.bitrate,
      duration: body.duration,
      genre: body.genre,
      format: body.format,
      size: body.size,
      order_id: orderId,
    }
  }
}

export function deleteTrackFromRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId, trackId: encodedTrackId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)
    const trackId = hashUtils.decodeId(encodedTrackId)

    if (!channelId || !trackId) {
      return
    }

    const channel = await knex
      .from(TableName.RadioChannels)
      .where({ [RadioChannelsProps.Id]: channelId })
      .first()

    if (!channel) {
      return
    }

    if (channel.user_id !== userId) {
      return ctx.throw(401)
    }

    await knex.transaction(async trx => {
      const trackToDelete = await trx
        .from<AudioTracksEntity>(TableName.AudioTracks)
        .where(AudioTracksProps.ChannelId, channelId)
        .where(AudioTracksProps.Id, trackId)
        .first()

      if (!trackToDelete) {
        return
      }

      await trx
        .from<AudioTracksEntity>(TableName.AudioTracks)
        .where(AudioTracksProps.ChannelId, channelId)
        .where(AudioTracksProps.Id, trackId)
        .delete()

      await trx
        .from<AudioTracksEntity>(TableName.AudioTracks)
        .where(AudioTracksProps.ChannelId, channelId)
        .where(AudioTracksProps.OrderId, ">", trackToDelete.order_id)
        .orderBy(AudioTracksProps.OrderId, "asc")
        .decrement(AudioTracksProps.OrderId)

      ctx.status = 200
    })
  }
}

export function startRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const timeService = container.get<TimeService>(TimeServiceType)

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ [RadioChannelsProps.Id]: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    try {
      const now = timeService.now()
      const nowDate = dateUtils.convertDateToIso(now)
      await knex<IPlayingChannelsEntity>(TableName.PlayingChannels).insert({
        channel_id: channel.id,
        start_offset: 0,
        started_at: nowDate,
        paused_at: null,
        created_at: nowDate,
        updated_at: nowDate,
      })
      ctx.status = 200
    } catch (e) {
      if (e.message.match(/constraint/)) {
        ctx.status = 409
        return
      }

      throw e
    }
  }
}

export function stopRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      return
    }

    const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const deletedRows = await knex<IPlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ channel_id: channel.id })
      .delete()
      .count()

    if (+deletedRows === 0) {
      ctx.throw(409)
    }

    ctx.status = 200
  }
}

export function pauseRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const timeService = container.get<TimeService>(TimeServiceType)

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      return
    }

    const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const now = timeService.now()
    const updatedRows = await knex<IPlayingChannelsEntity>(TableName.PlayingChannels)
      .where({
        channel_id: channel.id,
        paused_at: null,
      })
      .update({
        updated_at: dateUtils.convertDateToIso(now),
        paused_at: dateUtils.convertDateToIso(now),
      })
      .count()

    if (+updatedRows === 0) {
      ctx.throw(409)
    }

    ctx.status = 200
  }
}

export function resumeRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const timeService = container.get<TimeService>(TimeServiceType)

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      return
    }

    const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    await knex.transaction(async trx => {
      const playingChannel = await trx<IPlayingChannelsEntity>(TableName.PlayingChannels)
        .where({ channel_id: channel.id })
        .first()

      if (!playingChannel || playingChannel.paused_at === null) {
        ctx.throw(409)
      }

      const nowMillis = timeService.now()
      const startedAtMillis = dateUtils.convertDateToMillis(playingChannel.started_at)
      const pausedAtMillis = dateUtils.convertDateToMillis(playingChannel.paused_at)

      const updatedRows = await trx<IPlayingChannelsEntity>(TableName.PlayingChannels)
        .where({
          id: playingChannel.id,
        })
        .update({
          started_at: dateUtils.convertDateToIso(startedAtMillis + (nowMillis - pausedAtMillis)),
          paused_at: null,
        })
        .count()

      if (+updatedRows === 0) {
        ctx.throw(409)
      }
    })

    ctx.status = 200
  }
}

export function getNowPlaying(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)
  const timeService = container.get<TimeService>(TimeServiceType)
  const config = container.get<Config>(ConfigType)

  return async (ctx: Context): Promise<void> => {
    // const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      return
    }

    // const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
    //   .where({ id: channelId })
    //   .first()
    //
    // if (!channel) {
    //   ctx.throw(404)
    // }

    // if (channel.user_id !== userId) {
    //   ctx.throw(401)
    // }

    const playingChannel = await knex<PlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ channel_id: channelId })
      .first()

    if (!playingChannel || playingChannel.paused_at !== null) {
      ctx.throw(404)
      return
    }

    const tracks = await knex<AudioTracksEntity>(TableName.AudioTracks)
      .where({ channel_id: channelId })
      .orderBy(AudioTracksProps.OrderId, "asc")

    const now = timeService.now()

    const duration = tracks.reduce((acc, t) => acc + +t.duration, 0)
    const position = (now - dateUtils.convertDateToMillis(playingChannel.started_at)) % duration

    const trackIndexAndTrackOffset = calcTrackIndexAndTrackPosition(position, tracks)

    if (!trackIndexAndTrackOffset) {
      ctx.status = 204
      return
    }

    const nextTrackIndex = calcNextTrackIndex(trackIndexAndTrackOffset.index, tracks)

    const currentTrack = tracks[trackIndexAndTrackOffset.index]
    const nextTrack = tracks[nextTrackIndex]

    ctx.body = {
      position: trackIndexAndTrackOffset.index,
      current: {
        id: hashUtils.encodeId(currentTrack.id),
        offset: Math.floor(trackIndexAndTrackOffset.trackPosition),
        title: `${currentTrack.artist} - ${currentTrack.title}`,
        url: convertFileHashToFileUrl(currentTrack.hash, currentTrack.name, config.fileServerUrl),
      },
      next: {
        id: hashUtils.encodeId(nextTrack.id),
        title: `${nextTrack.artist} - ${nextTrack.title}`,
        url: convertFileHashToFileUrl(nextTrack.hash, currentTrack.name, config.fileServerUrl),
      },
    }
  }
}

const MoveTrackInPlaylistRequestContract = t.type(
  {
    index: t.number,
  },
  "MoveTrackInPlaylistRequestContract",
)

export function moveTrackInRadioChannel(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId, trackId: encodedTrackId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)
    const trackId = hashUtils.decodeId(encodedTrackId)

    if (!channelId || !trackId) {
      return
    }

    const { index } = decodeT(MoveTrackInPlaylistRequestContract)(ctx.request.body)
    // We assume that track's order_id always equals to track's index + 1.
    const newOrderId = index + 1

    const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    await knex.transaction(
      async (trx): Promise<void> => {
        const countQueryResult = await trx(TableName.AudioTracks)
          .where(AudioTracksProps.ChannelId, channelId)
          .count<[{ count: string }]>("id as count")
        const count = +countQueryResult[0]["count"]

        if (newOrderId < 1 || newOrderId > count) {
          return ctx.throw(400)
        }

        const track = await trx<AudioTracksEntity>(TableName.AudioTracks)
          .where(AudioTracksProps.ChannelId, channelId)
          .where(AudioTracksProps.Id, trackId)
          .first()

        if (!track) {
          return
        }

        if (newOrderId === track.order_id) {
          // Track moved to the same position: nothing to do.
          ctx.status = 200
          return
        }

        if (newOrderId > track.order_id) {
          await trx<AudioTracksEntity>(TableName.AudioTracks)
            .where(AudioTracksProps.ChannelId, channelId)
            .whereBetween(AudioTracksProps.OrderId, [track.order_id + 1, newOrderId])
            .orderBy(AudioTracksProps.OrderId, "asc")
            .decrement(AudioTracksProps.OrderId)
        } else {
          await trx<AudioTracksEntity>(TableName.AudioTracks)
            .where(AudioTracksProps.ChannelId, channelId)
            .whereBetween(AudioTracksProps.OrderId, [newOrderId, track.order_id - 1])
            .orderBy(AudioTracksProps.OrderId, "asc")
            .increment(AudioTracksProps.OrderId)
        }

        await trx<AudioTracksEntity>(TableName.AudioTracks)
          .where(AudioTracksProps.ChannelId, channelId)
          .where(AudioTracksProps.Id, trackId)
          .update(AudioTracksProps.OrderId, newOrderId)

        ctx.status = 200
      },
    )
  }
}

/**
 * todo Reimplement shuffle using SQL.
 *
 *      UPDATE tracks
 *        SET order_id = c2.seqnum
 *        FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY RANDOM()) seqnum FROM tracks) c2
 *      WHERE c2.id = tracks.id;
 */

export function shuffleRadioChannelTracks(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: TypedContext<AudioTrackResource[]>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      return
    }

    const channel = await knex<RadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    await knex.transaction(async trx => {
      let orderId = 1

      const tracks = await trx(TableName.AudioTracks)
        .where(AudioTracksProps.ChannelId, channelId)
        .orderByRaw("RANDOM()")

      const tracksWithUpdatedOrderIds = tracks.map(track => ({ ...track, orderId: orderId++ }))

      await Promise.all(
        tracksWithUpdatedOrderIds.map(track =>
          trx(TableName.AudioTracks)
            .where(AudioTracksProps.Id, track.id)
            .update(AudioTracksProps.OrderId, track.orderId),
        ),
      )

      ctx.body = tracksWithUpdatedOrderIds.map(audioTrack => ({
        id: hashUtils.encodeId(audioTrack.id),
        name: audioTrack.name,
        artist: audioTrack.artist,
        title: audioTrack.title,
        album: audioTrack.album,
        bitrate: audioTrack.bitrate,
        duration: audioTrack.duration,
        order_id: audioTrack.order_id,
        size: audioTrack.size,
        format: audioTrack.format,
        genre: audioTrack.genre,
      }))
    })
  }
}
