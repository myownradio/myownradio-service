import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppDependencies, AppDependenciesProvider } from "./dependencies";

export default function render(element: HTMLElement | null, dependencies: AppDependencies, Component: React.ComponentType): void {
  ReactDOM.render(
    <AppDependenciesProvider value={dependencies}>
      <Component />
    </AppDependenciesProvider>,
    element,
  );
}
