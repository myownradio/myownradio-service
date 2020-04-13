import * as knex from "knex";
import * as supertest from "supertest";
import * as winston from "winston";
import { createApp } from "../src/app";
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
    RADIOMANAGER_BACKEND_TOKEN_SECRET: "secret",
    RADIOMANAGER_BACKEND_METADATA_SECRET: "secret",
    RADIOMANAGER_BACKEND_DATABASE_URL: ":memory:",
    RADIOMANAGER_BACKEND_DATABASE_CLIENT: "sqlite3",
    RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL: "Infinity",
    RADIOMANAGER_BACKEND_ALLOWED_ORIGIN: "*",
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

describe("/healthcheck", () => {
  it("should respond with 200 on get request", async () => {
    await request.get("/healthcheck").expect(200);
  });
});

describe("/channels/create", () => {
  it("should respond with 200 on successful post request", async () => {
    await request
      .post("/channels/create")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .send({ title: "Foo Radio Me" })
      .expect(200, {
        id: 3,
        title: "Foo Radio Me",
      });
  });

  it("should respond with 400 on empty request body", async () => {
    await request
      .post("/channels/create")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(400);
  });

  it("should respond with 400 on malformed request body", async () => {
    await request
      .post("/channels/create")
      .send({ foo: "bar" })
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(400);
  });

  it("should respond with 401 if not authorized", async () => {
    await request.post("/channels/create").expect(401);
  });
});

describe("/channels/:id/tracks/add", () => {
  const rawMetadata =
    '{"hash":"d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c","size":32622,"name":"sine.mp3","duration":1.07475,"bitrate":242824,"format":"MP2/3 (MPEG audio layer 2/3)","artist":"Sine Artist","title":"Sine Title","album":"Sine Album","genre":"Sine Genre"}';

  const signature =
    "MTU4NTQzMjcwMzUyMy4yNjYzMWYzZGUxY2ZlZDk4YTgxMjEzNTk3MWNhNTA5ZWQzYmI1ZDFjNzA4YTVlZmNjNGJhNWM3NTI2NGZkMWVk";

  it("should respond with 200 on successful post request", async () => {
    await request
      .post("/channels/1/tracks/add")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .set("Content-Type", "application/json")
      .set("Signature", signature)
      .send(rawMetadata)
      .expect(200, {
        id: 3,
        name: "sine.mp3",
        title: "Sine Title",
        artist: "Sine Artist",
        album: "Sine Album",
        bitrate: 242824,
        duration: 1.07475,
        order_id: 2,
      });
  });

  it("should respond with 400 on empty request body", async () => {
    await request
      .post("/channels/1/tracks/add")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(400);
  });

  it("should respond with 400 on invalid signature", async () => {
    await request
      .post("/channels/1/tracks/add")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .set("Content-Type", "application/json")
      .set("Signature", "invalid")
      .send(rawMetadata)
      .expect(400);
  });

  it("should respond with 401 if not authorized", async () => {
    await request
      .post("/channels/1/tracks/add")
      .set("Content-Type", "application/json")
      .expect(401);
  });
});

describe("/channels", () => {
  it("should respond with 200 on successful get request", async () => {
    await request
      .get("/channels")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, [
        {
          id: 1,
          title: "Foo Radio",
        },
        {
          id: 2,
          title: "Foo 2 Radio",
        },
      ]);
  });

  it("should respond with 401 if not authorized", async () => {
    await request.get("/channels").expect(401);
  });
});

describe("GET /channels/:id", () => {
  it("should respond with 200 on successful get request", async () => {
    await request
      .get("/channels/1")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, {
        id: 1,
        title: "Foo Radio",
      });
  });

  it("should respond with 404 if channel not found", async () => {
    await request
      .get("/channels/10")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404);
  });

  it("should respond with 401 if channel belongs to other user", async () => {
    await request
      .get("/channels/1")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401);
  });

  it("should respond with 401 if not authorized", async () => {
    await request.get("/channels/1").expect(401);
  });
});

describe("GET /channels/:id/tracks", () => {
  it("should respond with 200 on successful get request", async () => {
    await request
      .get("/channels/1/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200, [
        {
          id: 1,
          name: "bob_marley_this_is_love.mp3",
          artist: "Bob Marley",
          title: "This Is Love",
          album: "Legend - The Best Of Bob Marley And The Wailers",
          bitrate: 242824,
          duration: 230.07475,
          order_id: 1,
        },
      ]);
  });

  it("should respond with 404 if channel not found", async () => {
    await request
      .get("/channels/10/tracks")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(404);
  });

  it("should respond with 401 if channel belongs to other user", async () => {
    await request
      .get("/channels/1/tracks")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401);
  });

  it("should respond with 401 if not authorized", async () => {
    await request.get("/channels/1/tracks").expect(401);
  });
});
