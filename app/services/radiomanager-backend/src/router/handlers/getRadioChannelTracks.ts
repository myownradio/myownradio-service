import { decodeId, encodeId } from "@mor/common/ids"
import { AudioTrackResource } from "@myownradio/domain/resources"
import * as knex from "knex"
import { Config } from "../../config"
import { TypedContext } from "../../interfaces"

export default function getRadioChannelTracks(_: Config, knexConnection: knex) {
  return async (ctx: TypedContext<AudioTrackResource[]>): Promise<void> => {
    const { channelId: hashedChannelId } = ctx.params
    const channelId = decodeId(hashedChannelId)

    if (!channelId) {
      ctx.throw(404)
    }

    const userId = ctx.state.user.uid

    const channel = await knexConnection
      .from("radio_channels")
      .where({ id: channelId })
      .first()

    if (!channel) {
      ctx.throw(404)
    }

    if (channel.user_id !== userId) {
      ctx.throw(401)
    }

    const audioTracks = await knexConnection
      .from("audio_tracks")
      .where("channel_id", channelId)
      .orderBy("order_id", "ASC")

    ctx.body = audioTracks.map(audioTrack => ({
      id: encodeId(audioTrack.id),
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
