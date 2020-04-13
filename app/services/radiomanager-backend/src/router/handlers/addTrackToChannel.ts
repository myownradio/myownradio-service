import * as t from "io-ts";
import * as knex from "knex";
import { Context } from "koa";
import { Config } from "../../config";
import { verifyMetadataSignature } from "../../utils";

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
});

export default function addTrackToChannel(config: Config, knexConnection: knex) {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid;
    const { channelId } = ctx.params;

    const rawMetadata = ctx.request.rawBody;
    const signature = ctx.get("signature");

    if (!verifyMetadataSignature(rawMetadata, signature, config.metadataSecret, config.metadataSignatureTtl)) {
      ctx.throw(400);
    }

    const channel = await knexConnection("radio_channels")
      .where({ id: channelId })
      .first();

    if (!channel) {
      ctx.throw(404);
    }

    if (channel.user_id !== userId) {
      ctx.throw(401);
    }

    const decodedRequest = AddTrackToChannelRequestContract.decode(ctx.request.body);

    if (decodedRequest._tag === "Left") {
      ctx.throw(400);
    }

    const requestBody = decodedRequest.right;

    const countObject = await knexConnection("audio_tracks")
      .where({ channel_id: channelId })
      .count("id as count");

    const totalTracks = +countObject[0]["count"];
    const nextOrderId = totalTracks + 1;

    const [trackId] = await knexConnection("audio_tracks")
      .insert({
        channel_id: channelId,
        user_id: userId,
        name: requestBody.name,
        hash: requestBody.hash,
        size: requestBody.size,
        artist: requestBody.artist,
        title: requestBody.title,
        album: requestBody.album,
        genre: requestBody.genre,
        bitrate: requestBody.bitrate,
        duration: requestBody.duration,
        format: requestBody.format,
        order_id: nextOrderId,
      })
      .returning("id");

    ctx.body = ctx.body = {
      id: trackId,
      name: requestBody.name,
      artist: requestBody.artist,
      title: requestBody.title,
      album: requestBody.album,
      bitrate: requestBody.bitrate,
      duration: requestBody.duration,
      order_id: nextOrderId,
    };
  };
}
