import { Container } from "inversify"
import * as bodyparser from "koa-bodyparser"
import * as createJwtMiddleware from "koa-jwt"
import * as Router from "koa-router"
import { Config } from "../config"
import { ConfigType } from "../di/types"
import * as routeHandlers from "./routeHandlers"
import { syncRadioChannelMiddleware } from "./syncRadioChannelMiddleware"

/*
 GET /channels
 get all user radio channels

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

export function createRouter(container: Container): Router {
  const config = container.get<Config>(ConfigType)

  const router = new Router()
  const jwtMiddleware = createJwtMiddleware({
    secret: config.tokenSecret,
  })

  router.get("/healthcheck", ctx => (ctx.status = 200))
  router.get("/channels", jwtMiddleware, routeHandlers.getRadioChannels(container))
  router.post("/channels/create", bodyparser(), jwtMiddleware, routeHandlers.createRadioChannel(container))
  router.get("/channels/:channelId/tracks", jwtMiddleware, routeHandlers.getRadioChannelTracks(container))
  router.post(
    "/channels/:channelId/tracks",
    bodyparser(),
    jwtMiddleware,
    syncRadioChannelMiddleware(container),
    routeHandlers.addTrackToRadioChannel(container),
  )
  router.del(
    "/channels/:channelId/tracks/:trackId",
    jwtMiddleware,
    syncRadioChannelMiddleware(container),
    routeHandlers.deleteTrackFromRadioChannel(container),
  )
  router.post(
    "/channels/:channelId/tracks/:trackId/move",
    bodyparser(),
    jwtMiddleware,
    syncRadioChannelMiddleware(container),
    routeHandlers.moveTrackInRadioChannel(container),
  )
  router.post("/channels/:channelId/start", jwtMiddleware, routeHandlers.startRadioChannel(container))
  router.post("/channels/:channelId/stop", jwtMiddleware, routeHandlers.stopRadioChannel(container))
  router.post("/channels/:channelId/pause", jwtMiddleware, routeHandlers.pauseRadioChannel(container))
  router.post("/channels/:channelId/resume", jwtMiddleware, routeHandlers.resumeRadioChannel(container))
  router.get("/channels/:channelId/now", jwtMiddleware, routeHandlers.getNowPlaying(container))

  return router
}
