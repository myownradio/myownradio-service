import * as path from "path";
import {
  IAudioTracksEntity,
  AudioTracksProps,
  RadioChannelsProps,
  TableName,
  IRadioChannelsEntity,
} from "@myownradio/entities/db";
import * as knex from "knex";
import { IMiddleware } from "koa-router";
import { Logger } from "winston";
import { makeMp3Preview } from "../../audio";
import { Config } from "../../config";
import { hashToPath } from "../../utils";

export default function audioPreview(knexConnection: knex, config: Config, logger: Logger): IMiddleware {
  return async (ctx): Promise<void> => {
    const userId = ctx.state.user.uid;
    const { trackId } = ctx.params;

    const result = await knexConnection
      .from<IAudioTracksEntity>(TableName.AudioTracks)
      .innerJoin<IRadioChannelsEntity>(
        TableName.RadioChannels,
        `${TableName.AudioTracks}.${AudioTracksProps.ChannelId}`,
        `${TableName.RadioChannels}.${RadioChannelsProps.Id}`,
      )
      .where(`${TableName.AudioTracks}.${AudioTracksProps.Id}`, trackId)
      .select<Pick<IAudioTracksEntity, "hash" | "name"> & Pick<IRadioChannelsEntity, "user_id">>(
        `${TableName.AudioTracks}.hash`,
        `${TableName.AudioTracks}.name`,
        `${TableName.RadioChannels}.user_id`,
      )
      .first();

    if (!result) {
      return ctx.throw(404);
    }

    if (result.user_id !== userId) {
      return ctx.throw(401);
    }

    const extension = path.extname(result.name);
    const audioFileUrl = `${config.fileServerUrl}/${hashToPath(result.hash)}${extension}`;

    ctx.set("Content-Type", "audio/mpeg");
    ctx.body = makeMp3Preview(audioFileUrl, logger.child({ lib: "ffmpeg" }));
  };
}
