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
    SCHEDULER_DATABASE_URL: ":memory:",
    SCHEDULER_DATABASE_CLIENT: "sqlite3",
    SCHEDULER_TOKEN_SECRET: "secret",
    SCHEDULER_ALLOWED_ORIGIN: "*",
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

describe("POST /channels/1/start", () => {
  it("should start the channel and respond with 200 on post request", async () => {
    await request
      .post("/channels/1/start")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .expect(200);
  });

  it("should fail with 401 when unauthorized", async () => {
    await request.post("/channels/1/start").expect(401);
  });

  it("should fail with 401 if authorized by someone else", async () => {
    await request
      .post("/channels/1/start")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(401);
  });

  it("should fail with 404 if channel does not exist", async () => {
    await request
      .post("/channels/11/start")
      .set("Authorization", `Bearer ${otherAuthorizationToken}`)
      .expect(404);
  });
});
