import * as knex from "knex"
import { Context } from "koa"
import { Config } from "../../config"

export default function getRadioChannelTracks(_: Config, knexConnection: knex) {
  return async (ctx: Context): Promise<void> => {
    const { channelId } = ctx.params
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
      id: audioTrack.id,
      name: audioTrack.name,
      artist: audioTrack.artist,
      title: audioTrack.title,
      album: audioTrack.album,
      bitrate: audioTrack.bitrate,
      duration: audioTrack.duration,
      order_id: audioTrack.order_id,
    }))
  }
}
