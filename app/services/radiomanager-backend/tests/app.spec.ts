import * as Application from "koa";
import * as request from "supertest";
import { createApp } from "../src/app";
import { Config } from "../src/config";

let config: Config;
let app: Application;

beforeEach(() => {
  config = new Config({
    RADIOMANAGER_BACKEND_TOKEN_SECRET: "token secret",
    RADIOMANAGER_BACKEND_METADATA_SECRET: "metadata secret",
  });
  app = createApp(config);
});

describe("healthcheck", () => {
  it("should respond with 200 on get request", async () => {
    await request(app.callback())
      .get("/healthcheck")
      .expect(200);
  });
});
