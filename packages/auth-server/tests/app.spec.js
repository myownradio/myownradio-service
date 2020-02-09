const knex = require("knex");
const supertest = require("supertest");
const createApp = require("../src/app");

const migrationsDir = `${__dirname}/../../../migrations`;
const seedsDir = `${__dirname}/../../../seeds`;

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsImlhdCI6MTUxNjIzOTAyMn0.Fknsf_nSFNdqS9JkFJABEEtMVffv9zR1_nrI2mAVx60";

const config = {
  AUTH_SERVER_TOKEN_SECRET: "secret",
  AUTH_SERVER_DATABASE_URL: ":memory:",
  AUTH_SERVER_DATABASE_CLIENT: "sqlite3",
  AUTH_SERVER_ACCESS_TOKEN_LIFETIME: 30,
  AUTH_SERVER_REFRESH_TOKEN_LIFETIME: 2592000,
  PORT: 8080
};

let request;
let knexConnection;

beforeEach(async () => {
  knexConnection = knex({
    connection: config.AUTH_SERVER_DATABASE_URL,
    client: config.AUTH_SERVER_DATABASE_CLIENT
  });

  await knexConnection.migrate.latest({
    directory: migrationsDir
  });

  await knexConnection.seed.run({
    directory: seedsDir
  });

  request = supertest(createApp(config, knexConnection).callback());
});

// eslint-disable-next-line jest/expect-expect
test("GET / - should respond with OK", async () => {
  await request.get("/").expect(200);
});

describe("/signup", () => {
  // eslint-disable-next-line jest/expect-expect
  test("POST /signup - should fail when body has no email or password", async () => {
    const responseMessage =
      'Both "email" and "password" parameters should be specified';

    await request.post("/signup").expect(400, responseMessage);

    await request
      .post("/signup")
      .send({ email: "someone@mail.com" })
      .expect(400, responseMessage);

    await request
      .post("/signup")
      .send({ password: "somepassword" })
      .expect(400, responseMessage);
  });

  test("POST /signup - should create user", async () => {
    await request
      .post("/signup")
      .send({ email: "someone@mail.com", password: "somepassword" })
      .expect(200);

    await expect(
      knexConnection("users")
        .where({ email: "someone@mail.com" })
        .first()
    ).resolves.toEqual({
      id: expect.any(Number),
      email: "someone@mail.com",
      password: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  // eslint-disable-next-line jest/expect-expect
  test("POST /signup - should fail if email already used by someone else", async () => {
    await request
      .post("/signup")
      .send({
        email: "foo@bar.baz",
        password: "123"
      })
      .expect(400, "Given email already used by someone else");
  });
});

describe("/login", () => {
  test("POST /login - should respond with authorization data", async () => {
    const response = await request
      .post("/login")
      .send({ email: "foo@bar.baz", password: "somepassword" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      email: "foo@bar.baz",
      refresh_token: expect.any(String),
      access_token: expect.any(String)
    });

    await expect(
      knexConnection("refresh_tokens")
        .where({ user_id: 1 })
        .first()
    ).resolves.toEqual({
      id: expect.any(Number),
      user_id: 1,
      refresh_token: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  // eslint-disable-next-line jest/expect-expect
  test("POST /login - should fail if email or password not specified", async () => {
    await request
      .post("/login")
      .expect(
        400,
        'Both "email" and "password" parameters should be specified'
      );
  });

  // eslint-disable-next-line jest/expect-expect
  test("POST /login - should fail if email or password aren't correct", async () => {
    await request
      .post("/login")
      .send({ email: "foo@bar.baz", password: "wrong" })
      .expect(401);

    await request
      .post("/login")
      .send({ email: "wrong@bar.baz", password: "wrong" })
      .expect(401);
  });
});

describe("/refreshToken", () => {
  test("POST /refreshToken - should update refresh token and create new access token", async () => {
    const response = await request
      .post("/refreshToken")
      .send({ refresh_token: "8e6112346a91d135e3cb8bbad7f5363eae2108ff" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      refresh_token: expect.any(String),
      access_token: expect.any(String)
    });
  });

  // eslint-disable-next-line jest/expect-expect
  test("POST /refreshToken - should fail if refresh token isn't valid", async () => {
    await request
      .post("/refreshToken")
      .send({ refresh_token: "invalid token" })
      .expect(401, "Refresh token isn't valid");
  });

  // eslint-disable-next-line jest/expect-expect
  test("POST /refreshToken - should fail if refresh token isn't specified", async () => {
    await request
      .post("/refreshToken")
      .expect(400, "Refresh token should be specified");
  });

  // eslint-disable-next-line jest/expect-expect
  test("POST /refreshToken - should fail if refresh token is expired", async () => {
    await request
      .post("/refreshToken")
      .send({ refresh_token: "dcb76e25b2079ee652d28f732f6679c441291d2e" })
      .expect(401, "Refresh token isn't valid");
  });
});

describe("/me", () => {
  // eslint-disable-next-line jest/expect-expect
  test("GET /me - should get authorized user details", async () => {
    await request
      .get("/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200, {
        id: 1,
        email: "foo@bar.baz"
      });
  });

  // eslint-disable-next-line jest/expect-expect
  test("GET /me - should fail if unauthorized", async () => {
    await request.get("/me").expect(401);
  });

  // eslint-disable-next-line jest/expect-expect
  test("GET /me - should fail if authorization is wrong", async () => {
    await request
      .get("/me")
      .set("Authorization", `Bearer Wrong`)
      .expect(401);
  });
});
