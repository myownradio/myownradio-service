const knex = require("knex");
const createApp = require("../src/app");

const migrationsDir = `${__dirname}/../../../migrations`;

const config = {
  AUTH_SERVER_TOKEN_SECRET: "secret",
  AUTH_SERVER_DATABASE_URL: ":memory:",
  AUTH_SERVER_DATABASE_CLIENT: "sqlite3",
  PORT: 8080
};

let knexConnection;

beforeEach(async () => {
  knexConnection = knex({
    connection: config.AUTH_SERVER_DATABASE_URL,
    client: config.AUTH_SERVER_DATABASE_CLIENT
  });

  await knexConnection.migrate.latest({
    directory: migrationsDir
  });
});

test("GET / - should respond with OK", async () => {
  const result = await knexConnection.raw("SELECT * FROM users");
});
