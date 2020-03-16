import { config } from "~/config";
import render from "./render";
import { createDependencies } from "./dependencies";

export default function bootstrap(): void {
  const dependencies = createDependencies(config);
  const rootElement = document.getElementById("root");

  render(rootElement, dependencies);
}
