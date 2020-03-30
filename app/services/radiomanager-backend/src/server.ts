import { createServer } from "http";
import { Config } from "./config";

const config = new Config(process.env);

const server = createServer((_req, res) => {
  res.end("OK");
});

server.listen(config.httpServerPort, () => {
  console.log(`Server listening on port ${config.httpServerPort}`);
});

process.on("SIGINT", () => {
  console.log("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  process.exit(0);
});
