import * as Application from "koa";
import { Config } from "./config";

export function createApp(_: Config): Application {
  return new Application();
}
