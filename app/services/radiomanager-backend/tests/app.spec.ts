import * as knex from "knex";
import * as supertest from "supertest";
import { createApp } from "../src/app";
import { Config } from "../src/config";

const authorizationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.Fknsf_nSFNdqS9JkFJABEEtMVffv9zR1_nrI2mAVx60";

const migrationsDir = `${__dirname}/../../../migrations`;
const seedsDir = `${__dirname}/../../../seeds`;

let config: Config;
let request: supertest.SuperTest<supertest.Test>;
let knexConnection: knex;

beforeEach(async () => {
  config = new Config({
    RADIOMANAGER_BACKEND_TOKEN_SECRET: "secret",
    RADIOMANAGER_BACKEND_METADATA_SECRET: "secret",
    RADIOMANAGER_BACKEND_DATABASE_URL: ":memory:",
    RADIOMANAGER_BACKEND_DATABASE_CLIENT: "sqlite3",
    RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL: "Infinity",
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

  request = supertest(createApp(config, knexConnection).callback());
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
      .send({ title: "Foo Radio" })
      .expect(200, {
        id: 2,
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
    '{"hash":"d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c","size":32622,"name":"sine.mp3","path":"d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c","duration":1.07475,"bitrate":242824,"format":"MP2/3 (MPEG audio layer 2/3)","artist":"Sine Artist","title":"Sine Title","album":"Sine Album","genre":"Sine Genre"}';

  const signature = "MTU4NTQyOTgwODY5My45YmEzNTcyYjI5YzZiOThjOTFhNDdlOGFhNzM3ZGFjZmVmMGY0NDFiMjU2MzM4MmVhZmIxMzIxMTlhMDIxZGQ0";

  it("should respond with 200 on successful post request", async () => {
    await request
      .post("/channels/1/tracks/add")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .set("Content-Type", "application/json")
      .set("Signature", signature)
      .send(rawMetadata)
      .expect(200, {
        id: 2,
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
