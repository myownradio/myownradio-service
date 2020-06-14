import * as path from "path"
import { pathUtils, entities as e } from "@myownradio/shared-server"
import * as knex from "knex"
import { IMiddleware } from "koa-router"
import { Logger } from "winston"
import { makeMp3Preview } from "../../audio"
import { Config } from "../../config"

export default function audioPreview(knexConnection: knex, config: Config, logger: Logger): IMiddleware {
  return async (ctx): Promise<void> => {
    const userId = ctx.state.user.uid
    const { trackId } = ctx.params

    const result = await knexConnection
      .from<e.IAudioTracksEntity>(e.TableName.AudioTracks)
      .innerJoin<e.IRadioChannelsEntity>(
        e.TableName.RadioChannels,
        `${e.TableName.AudioTracks}.${e.AudioTracksProps.ChannelId}`,
        `${e.TableName.RadioChannels}.${e.RadioChannelsProps.Id}`,
      )
      .where(`${e.TableName.AudioTracks}.${e.AudioTracksProps.Id}`, trackId)
      .select<Pick<e.IAudioTracksEntity, "hash" | "name"> & Pick<e.IRadioChannelsEntity, "user_id">>(
        `${e.TableName.AudioTracks}.hash`,
        `${e.TableName.AudioTracks}.name`,
        `${e.TableName.RadioChannels}.user_id`,
      )
      .first()

    if (!result) {
      return ctx.throw(404)
    }

    if (result.user_id !== userId) {
      return ctx.throw(401)
    }

    const extension = path.extname(result.name)
    const audioFileUrl = `${pathUtils.convertFileHashToFileUrl(result.hash, config.fileServerUrl)}${extension}`

    ctx.set("Content-Type", "audio/mpeg")
    ctx.body = makeMp3Preview(audioFileUrl, logger.child({ lib: "ffmpeg" }))
  }
}
