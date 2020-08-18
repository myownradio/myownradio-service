import * as knex from "knex"
import * as bodyparser from "koa-bodyparser"
import * as createJwtMiddleware from "koa-jwt"
import * as Router from "koa-router"
import { Logger } from "winston"
import { Config } from "../config"
import addTrackToChannel from "./handlers/addTrackToChannel"
import createChannel from "./handlers/createChannel"
import getChannel from "./handlers/getChannel"
import getChannels from "./handlers/getChannels"
import getRadioChannelTracks from "./handlers/getRadioChannelTracks"

/*
 GET /channels
 list all user radio channels

 POST /channels {title}
 create new user radio channel

 DELETE /channels/:channelId
 delete user channel

 GET /channels/:channelId/tracks
 get tracks in radio channel

 POST[signature] /channels/:channelId/tracks {name, hash, size, artist, title, album, genre, bitrate, duration, format}
 add track to radio channel

 DELETE /channels/:channelId/tracks/:trackId
 delete track from radio channel

 POST /channels/:channelId/tracks/:trackId/move {index}
 change track order in radio channel

 POST /channels/:channelId/stop
 stop radio channel

 POST /channels/:channelId/pause
 pause radio channel

 RESUME /channels/:channelId/resume
 resume radio channel

 POST /channels/:channelId/start
 start radio channel

 GET /channels/:channelId/now
 get what's playing on radio channel
*/

export function createRouter(config: Config, knexConnection: knex, _logger: Logger): Router {
  const router = new Router()
  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  })

  router.get("/healthcheck", ctx => (ctx.status = 200))
  router.get("/channels", jwtMiddleware, getChannels(config, knexConnection))
  router.post("/channels/create", bodyparser(), jwtMiddleware, createChannel(config, knexConnection))
  router.get("/channels/:channelId", jwtMiddleware, getChannel(config, knexConnection))
  router.get("/channels/:channelId/tracks", jwtMiddleware, getRadioChannelTracks(config, knexConnection))
  router.post("/channels/:channelId/tracks/add", bodyparser(), jwtMiddleware, addTrackToChannel(config, knexConnection))

  return router
}
