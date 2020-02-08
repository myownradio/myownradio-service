const request = require("supertest");
const createApp = require("../src/app");

const authenticationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtIjpbInVwbG9hZCJdLCJpYXQiOjE1MTYyMzkwMjJ9.6YVvCcjFSaHFw8HgbiUd-sVUQQxmcf8LaNGE7GXIQ6w";

let app;
beforeEach(() => {
  app = createApp({
    AUDIO_UPLOADER_ROOT_FOLDER: `${__dirname}/__fixtures__/uploadDir`,
    AUDIO_UPLOADER_TOKEN_SECRET: "secret",
    PORT: 8080
  });
});

test("Should upload audio file and return file information", async () => {
  const filepath = `${__dirname}/__fixtures__/sine.mp3`;

  await request(app.callback())
    .post("/upload")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .attach("source", filepath)
    .expect("content-type", /json/)
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

test.only("Should return file on try to download file that exists", async () => {
  await request(app.callback())
    .get("/d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3")
    .expect('content-type', /audio/)
    .expect(200);
});

test("Should throw 404 on try to download file that does not exist", async () => {
  await request(app.callback())
    .get("/a/a/aa21bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3")
    .expect(404);
});
