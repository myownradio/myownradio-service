import { createServer } from "http";

import { httpServerPort } from "./config";

const server = createServer((_req, res) => {
  res.end("OK");
});

server.listen(httpServerPort, () => {
  console.log(`Listening on :${httpServerPort}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  process.exit(0);
});
