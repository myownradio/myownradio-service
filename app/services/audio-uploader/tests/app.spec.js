const request = require("supertest");

const createApp = require("../src/app");
const { Config } = require("../src/config");
const { verifySignatureOfMetadata } = require("../src/utils");
const withTempDirectory = require("./with/withTempDirectory");

const authenticationToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtIjpbInVwbG9hZCJdLCJpYXQiOjE1MTYyMzkwMjJ9.6YVvCcjFSaHFw8HgbiUd-sVUQQxmcf8LaNGE7GXIQ6w";

const tempDirectory = withTempDirectory();

let app;
let config;

beforeEach(() => {
  config = new Config({
    AUDIO_UPLOADER_ROOT_DIR: `${__dirname}/__fixtures__/uploadDir`,
    AUDIO_UPLOADER_TOKEN_SECRET: "secret",
    AUDIO_UPLOADER_METADATA_SECRET: "secret",
    AUDIO_UPLOADER_TEMP_DIR: tempDirectory,
    PORT: 8080,
  });

  app = createApp(config);
});

test("POST /upload - upload new audio file", async () => {
  const filepath = `${__dirname}/__fixtures__/sine.mp3`;

  const { headers, text, request: r } = await request(app.callback())
    .post("/upload")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .attach("source", filepath)
    .expect("content-type", /json/)
    .expect("signature", /.+/)
    .expect(200, {
      name: "sine.mp3",
      hash: "d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c",
      size: 32622,
      artist: "Sine Artist",
      title: "Sine Title",
      album: "Sine Album",
      genre: "Sine Genre",
      bitrate: 242824,
      duration: 1.07475,
      format: "MP2/3 (MPEG audio layer 2/3)",
      path: "d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c",
    });

  expect(verifySignatureOfMetadata(text, headers.signature, config.metadataSecret, 30000)).toBeTruthy();
});

test("POST /upload - should fail if no file attached", async () => {
  await request(app.callback())
    .post("/upload")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .expect(400);
});
