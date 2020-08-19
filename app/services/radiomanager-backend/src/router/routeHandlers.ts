import { dateUtils, hashUtils } from "@myownradio/shared-server"
import {
  IRadioChannelsEntity,
  TableName,
  RadioChannelsProps,
  AudioTracksProps,
  IPlayingChannelsEntity,
  IPlayingChannelsEntity as PlayingChannelsEntity,
  IAudioTracksEntity as AudioTracksEntity,
} from "@myownradio/shared-server/lib/entities"
import { AudioTrackResource, RadioChannelResource } from "@myownradio/shared-types"
import { Container } from "inversify"
import * as t from "io-ts"
import { Context, Middleware } from "koa"
import { Config } from "../config"
import { ConfigType, KnexType, TimeServiceType } from "../di/types"
import { KnexConnection, TypedContext } from "../interfaces"
import { decodeT } from "../io"
import { TimeService } from "../time"
import { calcTrackIndexAndOffset, calcNextTrackIndex, getUserIdFromContext, verifyMetadataSignature } from "../utils"

export function getRadioChannels(container: Container): Middleware {
  const knex = container.get<KnexConnection>(KnexType)

  return async (ctx: TypedContext<RadioChannelResource[]>): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const channels = await knex
      .from<IRadioChannelsEntity>(TableName.RadioChannels)
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

    const deletedRows = await knex
      .from(TableName.AudioTracks)
      .where(AudioTracksProps.ChannelId, channelId)
      .where(AudioTracksProps.Id, trackId)
      .delete()

    if (+deletedRows === 0) {
      return
    }

    ctx.status = 200
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

    const channel = await knex<IRadioChannelsEntity>(TableName.RadioChannels)
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

    const channel = await knex<IRadioChannelsEntity>(TableName.RadioChannels)
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

    const channel = await knex<IRadioChannelsEntity>(TableName.RadioChannels)
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

    const channel = await knex<IRadioChannelsEntity>(TableName.RadioChannels)
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

  return async (ctx: Context): Promise<void> => {
    const userId = getUserIdFromContext(ctx)
    const { channelId: encodedChannelId } = ctx.params
    const channelId = hashUtils.decodeId(encodedChannelId)

    if (!channelId) {
      return
    }

    const channel = await knex<IRadioChannelsEntity>(TableName.RadioChannels)
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const playingChannel = await knex<PlayingChannelsEntity>(TableName.PlayingChannels)
      .where({ channel_id: channel.id })
      .first()

    if (!playingChannel || playingChannel.paused_at !== null) {
      ctx.throw(404)
      return
    }

    const tracks = await knex<AudioTracksEntity>(TableName.AudioTracks)
      .where({ channel_id: channel.id })
      .orderBy(AudioTracksProps.OrderId, "asc")

    const now = timeService.now()

    const duration = tracks.reduce((acc, t) => acc + +t.duration, 0)
    const position = (now - dateUtils.convertDateToMillis(playingChannel.started_at)) % duration

    const probablyIndexAndOffset = calcTrackIndexAndOffset(position, tracks)

    if (!probablyIndexAndOffset) {
      ctx.status = 204
      return
    }

    const nextTrackIndex = calcNextTrackIndex(probablyIndexAndOffset.index, tracks)

    const currentTrack = tracks[probablyIndexAndOffset.index]
    const nextTrack = tracks[nextTrackIndex]

    // todo add correct urls
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
