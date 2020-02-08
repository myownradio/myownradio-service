const request = require("supertest");
const createApp = require("../src/app");

const authenticationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtIjpbInVwbG9hZCJdLCJpYXQiOjE1MTYyMzkwMjJ9.6YVvCcjFSaHFw8HgbiUd-sVUQQxmcf8LaNGE7GXIQ6w";

let app;
beforeEach(() => {
  app = createApp({
    AUDIO_UPLOADER_ROOT_FOLDER: "/tmp/tests/audio-uploader/",
    AUDIO_UPLOADER_TOKEN_SECRET: "secret",
    PORT: 8080
  });
});

test("Should upload audio file", async () => {
  const filepath = `${__dirname}/__fixtures__/sine.mp3`;

  await request(app.callback())
    .post("/upload")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .attach("source", filepath)
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
      format: "MP2/3 (MPEG audio layer 2/3)"
    });
});
