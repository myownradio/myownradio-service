const knex = require("knex");
const supertest = require("supertest");
const createApp = require("../src/app");

const migrationsDir = `${__dirname}/../../../migrations`;

const config = {
  AUTH_SERVER_TOKEN_SECRET: "secret",
  AUTH_SERVER_DATABASE_URL: ":memory:",
  AUTH_SERVER_DATABASE_CLIENT: "sqlite3",
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

  request = supertest(createApp(config, knexConnection).callback());
});

// eslint-disable-next-line jest/expect-expect
test("GET / - should respond with OK", async () => {
  await request.get("/").expect(200);
});

// eslint-disable-next-line jest/expect-expect
test("POST /signup - should fail with 400 when body has no email or password", async () => {
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
    .send({
      email: "someone@mail.com",
      password: "somepassword"
    })
    .expect(200);

  const createdUser = await knexConnection("users")
    .where({ email: "someone@mail.com" })
    .first();

  expect(createdUser).toEqual({
    id: 1,
    email: "someone@mail.com",
    password: expect.any(String),
    created_at: expect.any(String),
    updated_at: expect.any(String)
  });
});
