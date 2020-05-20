import * as knex from "knex"
import * as supertest from "supertest"
import * as winston from "winston"
import { createApp } from "../src/app"
import { Config } from "../src/config"
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

  timeService = new FixedTimeService(1586849301429)

  config = new Config({
    SCHEDULER_DATABASE_URL: ":memory:",
    SCHEDULER_DATABASE_CLIENT: "sqlite3",
    SCHEDULER_TOKEN_SECRET: "secret",
    SCHEDULER_ALLOWED_ORIGIN: "*",
  })

  knexConnection = knex({
    connection: config.databaseUrl,
    client: config.databaseClient,
    useNullAsDefault: true,
  })

  await knexConnection.migrate.latest({
    directory: migrationsDir,
  })

  await knexConnection.seed.run({
    directory: seedsDir,
  })

  request = supertest(createApp(config, knexConnection, logger, timeService).callback())
})

describe("/healthcheck", () => {
  it("should respond with 200 on get request", async () => {
    await request.get("/healthcheck").expect(200)
  })
})

describe("POST /channels/1/start", () => {
  it("should start the channel and respond with 200 on post request", async () => {
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
  })
})

describe("POST /channels/2/stop", () => {
  it("should stop the channel and respond with 200 on post request", async () => {
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
  })
})

describe("POST /channels/:channelId/pause", () => {
  it("should pause the channel and respond with 200 on post request", async () => {
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
  })
})

describe("POST /channels/:channelId/resume", () => {
  it("should resume the channel and respond with 200 on post request", async () => {
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

describe("GET /channels/:channelId/nowPlaying", () => {
  it("should get what's playing and respond with 200 on get request", async () => {
    await request
      .get("/channels/RB2a1y/nowPlaying")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, {
        track_id: "RB2a1y",
        offset: 95136.5,
      })
  })

  it("should fail with 409 if channel isn't playing", async () => {
    await request
      .get("/channels/kOD613/nowPlaying")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(409)
  })

  it("should fail with 401 when unauthorized", async () => {
    await request.get("/channels/kOD613/nowPlaying").expect(401)
  })

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .get("/channels/kOD613/nowPlaying")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401)
  })

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .get("/channels/Vx7d1E/nowPlaying")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404)
  })
})
