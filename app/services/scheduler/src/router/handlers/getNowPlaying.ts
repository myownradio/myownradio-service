import * as knex from "knex";
import { Context, Middleware } from "koa";
import { TimeService } from "../../time";

export default function getNowPlaying(knexConnection: knex, timeService: TimeService): Middleware {
  return async (ctx: Context): Promise<void> => {
    const userId = ctx.state.user.uid;

    const { channelId } = ctx.params;

    const channel = await knexConnection("radio_channels")
      .where({ id: channelId })
      .first();

    if (!channel) {
      ctx.throw(404);
    }

    if (channel.user_id !== userId) {
      ctx.throw(401);
    }

    const playingChannel = await knexConnection("playing_channels")
      .where({ channel_id: channelId })
      .first();

    if (!playingChannel || playingChannel.paused_at !== null) {
      ctx.throw(409);
    }

    const channelAudioTracks = await knexConnection("audio_tracks")
      .where({ channel_id: channelId })
      .orderBy("order_id", "asc");
    const now = timeService.now();
    const playlistDuration = channelAudioTracks.reduce((acc, t) => acc + t.duration, 0);
    const playlistPosition = (now - playingChannel.started_at) % (playlistDuration * 1000);

    ctx.status = 501;
  };
}
