import { hashUtils } from "@myownradio/shared-server"
import {
  IRadioChannelsEntity,
  TableName,
  RadioChannelsProps,
  AudioTracksProps,
} from "@myownradio/shared-server/lib/entities"
import { AudioTrackResource, RadioChannelResource } from "@myownradio/shared-types"
import { Container } from "inversify"
import * as t from "io-ts"
import { Context, Middleware } from "koa"
import { Config } from "../config"
import { ConfigType, KnexType } from "../di/types"
import { KnexConnection, TypedContext } from "../interfaces"
import { decodeT, verifyMetadataSignature } from "../utils"

function getUserIdFromContext(ctx: Context): number {
  if (typeof ctx.state.user?.uid !== "number") {
    throw new TypeError(`Expected user id to be valid number`)
  }
  return ctx.state.user.uid
}

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
  return async (ctx: Context): Promise<void> => {
    void container
    void ctx
  }
}

export function startRadioChannel(container: Container): Middleware {
  return async (ctx: Context): Promise<void> => {
    void container
    void ctx
  }
}

export function stopRadioChannel(container: Container): Middleware {
  return async (ctx: Context): Promise<void> => {
    void container
    void ctx
  }
}

export function pauseRadioChannel(container: Container): Middleware {
  return async (ctx: Context): Promise<void> => {
    void container
    void ctx
  }
}

export function resumeRadioChannel(container: Container): Middleware {
  return async (ctx: Context): Promise<void> => {
    void container
    void ctx
  }
}

export function getNowPlaying(container: Container): Middleware {
  return async (ctx: Context): Promise<void> => {
    void container
    void ctx
  }
}
