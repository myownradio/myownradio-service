import { createSignature } from "@myownradio/shared-server/lib/signature"
import { Container } from "inversify"
import * as knex from "knex"
import * as supertest from "supertest"
import * as winston from "winston"
import { createApp } from "../src/app"
import { Config } from "../src/config"
import { ConfigType, KnexType, LoggerType, TimeServiceType } from "../src/di/types"
import { FixedTimeService, TimeService } from "../src/time"

const authorizationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.Fknsf_nSFNdqS9JkFJABEEtMVffv9zR1_nrI2mAVx60"
const otherAuthorizationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImlhdCI6MTUxNjIzOTAyMn0.5nA5QaNjZmg3Xix3wJm09N35cFWX3YanHQzjz-zSlDc"

const migrationsDir = `${__dirname}/../../../migrations`
const seedsDir = `${__dirname}/../../../seeds`

let config: Config
let request: supertest.SuperTest<supertest.Test>
let knexConnection: knex
let timeService: TimeService

beforeEach(async () => {
  const logger = winston.createLogger({
    silent: true,
  })

  config = new Config({
    RADIOMANAGER_BACKEND_TOKEN_SECRET: "secret",
    RADIOMANAGER_BACKEND_METADATA_SECRET: "secret",
    RADIOMANAGER_BACKEND_DATABASE_URL: ":memory:",
    RADIOMANAGER_BACKEND_DATABASE_CLIENT: "sqlite3",
    RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL: "Infinity",
    RADIOMANAGER_BACKEND_ALLOWED_ORIGIN: "*",
  })

  knexConnection = knex({
    connection: config.databaseUrl,
    client: config.databaseClient,
    useNullAsDefault: true,
  })

  timeService = new FixedTimeService(1586849301429)

  await knexConnection.migrate.latest({
    directory: migrationsDir,
  })

  await knexConnection.seed.run({
    directory: seedsDir,
  })

  const container = new Container()

  container.bind(ConfigType).toConstantValue(config)
  container.bind(LoggerType).toConstantValue(logger)
  container.bind(KnexType).toConstantValue(knexConnection)
  container.bind(TimeServiceType).toConstantValue(timeService)

  request = supertest(createApp(container).callback())
})

describe("/healthcheck", () => {
  it("should respond with 200 on get request", async () => {
    await request.get("/healthcheck").expect(200)
  })
})

describe("/channels/create", () => {
  it("should respond with 200 on successful post request", async () => {
    await request
      .post("/channels/create")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .send({ title: "Foo Radio Me" })
      .expect(200, {
        id: "5xGEBm",
        title: "Foo Radio Me",
      })
  })

  it("should respond with 400 on empty request body", async () => {
    await request
      .post("/channels/create")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(400)
  })

  it("should respond with 400 on malformed request body", async () => {
    await request
      .post("/channels/create")
      .send({ foo: "bar" })
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(400)
  })

  it("should respond with 401 if not authorized", async () => {
    await request.post("/channels/create").expect(401)
  })
})

describe("/channels/:id/tracks", () => {
  const rawMetadata =
    '{"hash":"d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c","size":32622,"name":"sine.mp3","duration":1.07475,"bitrate":242824,"format":"MP2/3 (MPEG audio layer 2/3)","artist":"Sine Artist","title":"Sine Title","album":"Sine Album","genre":"Sine Genre"}'

  const signature =
    "MTU4NTQzMjcwMzUyMy4yNjYzMWYzZGUxY2ZlZDk4YTgxMjEzNTk3MWNhNTA5ZWQzYmI1ZDFjNzA4YTVlZmNjNGJhNWM3NTI2NGZkMWVk"

  it("should respond with 200 on successful post request", async () => {
    await request
      .post("/channels/kOD613/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .set("Content-Type", "application/json")
      .set("Signature", signature)
      .send(rawMetadata)
      .expect(200, {
        id: "5xGEBm",
        name: "sine.mp3",
        title: "Sine Title",
        artist: "Sine Artist",
        album: "Sine Album",
        bitrate: 242824,
        duration: 1.07475,
        order_id: 2,
        format: "MP2/3 (MPEG audio layer 2/3)",
        genre: "Sine Genre",
        size: 32622,
      })
  })

  it("should respond with 400 on empty request body", async () => {
    await request
      .post("/channels/kOD613/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(400)
  })

  it("should respond with 400 on invalid signature", async () => {
    await request
      .post("/channels/kOD613/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .set("Content-Type", "application/json")
      .set("Signature", "invalid")
      .send(rawMetadata)
      .expect(400)
  })

  it("should respond with 401 if not authorized", async () => {
    await request
      .post("/channels/kOD613/tracks")
      .set("Content-Type", "application/json")
      .expect(401)
  })
})

describe("/channels", () => {
  it("should respond with 200 on successful get request", async () => {
    await request
      .get("/channels")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, [
        {
          id: "kOD613",
          title: "Foo Radio",
        },
        {
          id: "RB2a1y",
          title: "Foo 2 Radio",
        },
      ])
  })

  it("should respond with 401 if not authorized", async () => {
    await request.get("/channels").expect(401)
  })
})

describe("GET /channels/:id/tracks", () => {
  it("should respond with 200 on successful get request", async () => {
    await request
      .get("/channels/kOD613/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, [
        {
          id: "kOD613",
          name: "bob_marley_this_is_love.mp3",
          artist: "Bob Marley",
          title: "This Is Love",
          album: "Legend - The Best Of Bob Marley And The Wailers",
          bitrate: 242824,
          duration: 230074.75,
          order_id: 1,
          format: "MP2/3 (MPEG audio layer 2/3)",
          genre: "Reggae",
          size: 8773803,
        },
      ])
  })

  it("should respond with 404 if channel not found", async () => {
    await request
      .get("/channels/pOklxN/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404)
  })

  it("should respond with 401 if channel belongs to other user", async () => {
    await request
      .get("/channels/RB2a1y/tracks")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should respond with 401 if not authorized", async () => {
    await request.get("/channels/kOD613/tracks").expect(401)
  })
})

describe("DELETE /channels/:channelId/tracks/:trackId", () => {
  it("should respond with 200 on successful get request", async () => {
    await request
      .delete("/channels/kOD613/tracks/kOD613")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200)

    await request
      .get("/channels/kOD613/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, [])
  })

  it("should respond with 404 if channel not found", async () => {
    await request
      .delete("/channels/pOklxN/tracks/kOD613")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404)
  })

  it("should respond with 404 if track not found", async () => {
    await request
      .delete("/channels/kOD613/tracks/pOklxN")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404)
  })

  it("should respond with 401 if channel belongs to other user", async () => {
    await request
      .delete("/channels/RB2a1y/tracks/pOklxN")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should respond with 404 if wrong channel id or wrong track id", async () => {
    await request
      .delete("/channels/wrong/tracks/kOD613")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404)

    await request
      .delete("/channels/kOD613/tracks/wrong")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404)
  })

  it("should respond with 401 if not authorized", async () => {
    await request.delete("/channels/kOD613/tracks/pOklxN").expect(401)
  })
})

describe("POST /channels/:channelId/start", () => {
  it("should start the channel and respond with status 200", async () => {
    await request
      .post("/channels/kOD613/start")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200)
  })

  it("should fail with 409 if channel already started", async () => {
    await request
      .post("/channels/RB2a1y/start")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(409)
  })

  it("should fail with 401 when unauthorized", async () => {
    await request.post("/channels/kOD613/start").expect(401)
  })

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .post("/channels/kOD613/start")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .post("/channels/Vx7d1E/start")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)

    await request
      .post("/channels/wrong/start")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)
  })
})

describe("POST /channels/:channelId/stop", () => {
  it("should stop the channel and respond with status 200", async () => {
    await request
      .post("/channels/RB2a1y/stop")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200)
  })

  it("should fail with 409 if channel isn't playing", async () => {
    await request
      .post("/channels/kOD613/stop")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(409)
  })

  it("should fail with 401 when unauthorized", async () => {
    await request.post("/channels/kOD613/stop").expect(401)
  })

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .post("/channels/kOD613/stop")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .post("/channels/Vx7d1E/stop")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)

    await request
      .post("/channels/wrong/stop")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)
  })
})

describe("POST /channels/:channelId/pause", () => {
  it("should pause the channel and respond with status 200", async () => {
    await request
      .post("/channels/RB2a1y/pause")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200)
  })

  it("should fail with 409 if channel isn't playing", async () => {
    await request
      .post("/channels/kOD613/pause")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(409)
  })

  it("should fail with 401 when unauthorized", async () => {
    await request.post("/channels/kOD613/pause").expect(401)
  })

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .post("/channels/kOD613/pause")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .post("/channels/Vx7d1E/pause")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)

    await request
      .post("/channels/wrong/pause")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)
  })
})

describe("POST /channels/:channelId/resume", () => {
  it("should resume the channel and respond with status 200", async () => {
    await request
      .post("/channels/RB2a1y/pause")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200)

    await request
      .post("/channels/RB2a1y/resume")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200)
  })

  it("should fail with 409 if channel isn't playing", async () => {
    await request
      .post("/channels/kOD613/resume")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(409)
  })

  it("should fail with 409 if channel isn't paused", async () => {
    await request
      .post("/channels/RB2a1y/resume")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(409)
  })

  it("should fail with 401 when unauthorized", async () => {
    await request.post("/channels/kOD613/pause").expect(401)
  })

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .post("/channels/kOD613/pause")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .post("/channels/Vx7d1E/pause")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)
  })
})

describe("GET /channels/:channelId/now", () => {
  // todo write test for multiple tracks in playlist
  it("should get what's playing and respond with 200 on get request", async () => {
    await request
      .get("/channels/RB2a1y/now")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, {
        position: 0,
        current: {
          id: "RB2a1y",
          offset: 95136.5,
          title: "Bob Marley - This Is Love",
          url: "todo",
        },
        next: {
          id: "RB2a1y",
          title: "Bob Marley - This Is Love",
          url: "todo",
        },
      })
  })

  it("should fail with 404 if channel isn't playing", async () => {
    await request
      .get("/channels/kOD613/now")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404)
  })

  it("should fail with 401 when unauthorized", async () => {
    await request.get("/channels/kOD613/now").expect(401)
  })

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .get("/channels/kOD613/now")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .get("/channels/Vx7d1E/now")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)

    await request
      .get("/channels/wrong/now")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)
  })
})

describe("sync playing channel position", () => {
  it.only("should sync on add new track to playlist", async () => {
    const newTrackMetadata = {
      name: "New Track Name",
      hash: "New Track Hash",
      size: 1234567,
      artist: "New Track Artist",
      title: "New Track Title",
      album: "New Track Album",
      genre: "New Track Genre",
      bitrate: 128000,
      duration: 3700000,
      format: "MP2/3 (MPEG audio layer 2/3)",
    }
    const rawMetadata = JSON.stringify(newTrackMetadata)
    const newTrackSignature = createSignature(rawMetadata, config.metadataSecret)

    await request
      .get("/channels/RB2a1y/now")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, {
        position: 0,
        current: {
          id: "RB2a1y",
          offset: 95136.5,
          title: "Bob Marley - This Is Love",
          url: "todo",
        },
        next: {
          id: "RB2a1y",
          title: "Bob Marley - This Is Love",
          url: "todo",
        },
      })

    await request
      .post("/channels/RB2a1y/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .set("Content-Type", "application/json")
      .set("Signature", newTrackSignature)
      .send(rawMetadata)
      .expect(200)

    await request
      .get("/channels/RB2a1y/now")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, {
        position: 0,
        current: {
          id: "RB2a1y",
          offset: 95137,
          title: "Bob Marley - This Is Love",
          url: "todo",
        },
        next: {
          id: "5xGEBm",
          title: "New Track Artist - New Track Title",
          url: "todo",
        },
      })
  })
})
