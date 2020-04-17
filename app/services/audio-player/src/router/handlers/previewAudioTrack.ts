import { PassThrough } from "stream";
import {
  IAudioTracksEntity,
  AudioTracksProps,
  RadioChannelsProps,
  TableName,
  IRadioChannelsEntity,
} from "@myownradio/entities/db";
import * as knex from "knex";
import { IMiddleware } from "koa-router";
import { createPreviewStream } from "../../utils";

export default function previewAudioTrack(knexConnection: knex): IMiddleware {
  return async (ctx): Promise<void> => {
    // const userId = ctx.state.user.uid;
    const { trackId } = ctx.params;

    const result = await knexConnection
      .from<IAudioTracksEntity>(TableName.AudioTracks)
      .innerJoin<IRadioChannelsEntity>(
        TableName.RadioChannels,
        `${TableName.AudioTracks}.${AudioTracksProps.ChannelId}`,
        `${TableName.RadioChannels}.${RadioChannelsProps.Id}`,
      )
      .where(`${TableName.AudioTracks}.${AudioTracksProps.Id}`, trackId)
      .select<Pick<IAudioTracksEntity, "hash"> & Pick<IRadioChannelsEntity, "user_id">>(
        `${TableName.AudioTracks}.hash`,
        `${TableName.RadioChannels}.user_id`,
      )
      .first();

    if (!result) {
      return ctx.throw(404);
    }

    // if (result.user_id !== userId) {
    //   return ctx.throw(401);
    // }

    const pass = new PassThrough();
    createPreviewStream("https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_5MG.mp3", pass);
    ctx.set('Content-Type', 'audio/mpeg');
    ctx.body = pass;
  };
}
