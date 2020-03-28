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
    RADIOMANAGER_BACKEND_METADATA_SECRET: "metadata secret",
    RADIOMANAGER_BACKEND_DATABASE_URL: ":memory:",
    RADIOMANAGER_BACKEND_DATABASE_CLIENT: "sqlite3",
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
        title: "Foo Radio",
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

  it("should respond with 401 without authorization", async () => {
    await request.post("/channels/create").expect(401);
  });
});

describe("/channels/:id/tracks/add", () => {
  it("should respond with 200 on successful post request", async () => {
    const metadata = {};
    const signature = "";

    await request
      .post("/channels/1/tracks/add")
      .set("Authorization", `Bearer ${authorizationToken}`)
      .send({ metadata, signature })
      .expect(200, {});
  });
});
