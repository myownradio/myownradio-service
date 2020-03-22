const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const supertest = require("supertest");

const createAppServer = require("../src/app");

const mock = new MockAdapter(axios);

mock.onHead("http://permanent/path/to/file").reply(200);
mock.onHead("http://temporary/path/to/file2").reply(200);

const config = {
  OVERLAY_PROXY_PERMANENT_SERVER: "http://permanent",
  OVERLAY_PROXY_TEMPORARY_SERVER: "http://temporary",
  PORT: 8080,
};

let request;

beforeEach(() => {
  request = supertest(createAppServer(config));
});

// eslint-disable-next-line jest/expect-expect
test("GET /path/to/file - should redirect to permanent file location", async () => {
  await request
    .get("/path/to/file")
    .expect(302)
    .expect("location", "http://permanent/path/to/file");
});

// eslint-disable-next-line jest/expect-expect
test("GET /path/to/file2 - should redirect to temporary file location", async () => {
  await request
    .get("/path/to/file2")
    .expect(302)
    .expect("location", "http://temporary/path/to/file2");
});

// eslint-disable-next-line jest/expect-expect
test("GET /path/to/other/file - should fail if file not found", async () => {
  await request.get("/path/to/other/file").expect(404);
});
