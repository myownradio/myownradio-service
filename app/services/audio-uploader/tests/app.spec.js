const request = require("supertest");
const createApp = require("../src/app");

const authenticationToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwZXJtIjpbInVwbG9hZCJdLCJpYXQiOjE1MTYyMzkwMjJ9.6YVvCcjFSaHFw8HgbiUd-sVUQQxmcf8LaNGE7GXIQ6w";

let app;
beforeEach(() => {
  app = createApp({
    AUDIO_UPLOADER_ROOT_FOLDER: `${__dirname}/__fixtures__/uploadDir`,
    AUDIO_UPLOADER_TOKEN_SECRET: "secret",
    PORT: 8080,
  });
});

test("POST /upload - upload new audio file", async () => {
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
      format: "MP2/3 (MPEG audio layer 2/3)",
      path: "d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c",
    });
});

test("POST /upload - should fail if no file attached", async () => {
  await request(app.callback())
    .post("/upload")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .expect(400);
});

test("GET /d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3 - should get file contents", async () => {
  await request(app.callback())
    .get("/d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3")
    .expect("content-type", /audio/)
    .expect(200);
});

test("HEAD /d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3 - should get headers", async () => {
  await request(app.callback())
    .head("/d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3")
    .expect("content-type", /audio/)
    .expect(200);
});

test("GET /a/a/aa21bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3 - should return 404", async () => {
  await request(app.callback())
    .get("/a/a/aa21bc63dd8f6dee822baa1b2a69b4e9a4d97a7c.mp3")
    .expect(404);
});
