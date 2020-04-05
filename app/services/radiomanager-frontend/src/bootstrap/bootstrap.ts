import { config } from "~/config";

import { createDependencies } from "./dependencies";
import render from "./render";

export default function bootstrap(Component: React.ComponentType): void {
  const dependencies = createDependencies(config);
  const rootElement = document.getElementById("root") as HTMLElement;

  render(rootElement, dependencies, Component);
}
