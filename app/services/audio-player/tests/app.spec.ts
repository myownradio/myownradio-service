import * as knex from "knex";
import * as supertest from "supertest";
import * as winston from "winston";
import { createApp } from "../src/app";
import { isMp3Header } from "../src/audio";
import { Config } from "../src/config";

const authorizationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.Fknsf_nSFNdqS9JkFJABEEtMVffv9zR1_nrI2mAVx60";
const otherAuthorizationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImlhdCI6MTUxNjIzOTAyMn0.5nA5QaNjZmg3Xix3wJm09N35cFWX3YanHQzjz-zSlDc";

const migrationsDir = `${__dirname}/../../../migrations`;
const seedsDir = `${__dirname}/../../../seeds`;

let config: Config;
let request: supertest.SuperTest<supertest.Test>;
let knexConnection: knex;

beforeEach(async () => {
  const logger = winston.createLogger({
    silent: true,
  });

  config = new Config({
    AUDIO_PLAYER_TOKEN_SECRET: "secret",
    AUDIO_PLAYER_DATABASE_URL: ":memory:",
    AUDIO_PLAYER_DATABASE_CLIENT: "sqlite3",
    AUDIO_PLAYER_ALLOWED_ORIGIN: "*",
    AUDIO_PLAYER_FILE_SERVER_URL: `${__dirname}/__fixtures__/uploadDir`,
  });

  knexConnection = knex({
    connection: config.databaseUrl,
    client: config.databaseClient,
    useNullAsDefault: true,
  });

  await knexConnection.migrate.latest({
    directory: migrationsDir,
  });

  await knexConnection.seed.run({
    directory: seedsDir,
  });

  request = supertest(createApp(config, knexConnection, logger).callback());
});

test("GET /healthcheck", async () => {
  await request.get("/healthcheck").expect(200);
});

describe("GET /audio/preview", () => {
  xit("should produce mp3 audio stream when authorized with header", async () => {
    const response = await request
      .get("/audio/preview/1")
      .auth(authorizationToken, { type: "bearer" })
      .expect(200)
      .expect("Content-Type", "audio/mpeg")
      .buffer(true)
      .parse((res, fn) => {
        res.once("data", buffer => {
          fn(null, buffer);
        });
      });

    expect(isMp3Header(response.body)).toBe(true);
  });

  it("should fail with 401 if user is not authorized", async () => {
    await request.get("/audio/preview/1").expect(401);
  });

  it("should fail with 401 if file belongs to other user", async () => {
    await request
      .get("/audio/preview/1")
      .auth(otherAuthorizationToken, { type: "bearer" })
      .expect(401);
  });

  it("should fail with 404 if file not found", async () => {
    await request
      .get("/audio/preview/10")
      .auth(authorizationToken, { type: "bearer" })
      .expect(404);
  });
});
