import * as React from "react";
import * as ReactDOM from "react-dom";
import {} from "react-dom/experimental";

import { AppDependencies, AppDependenciesProvider } from "./dependencies";

export default function render(
  element: HTMLElement,
  dependencies: AppDependencies,
  Component: React.ComponentType,
): void {
  ReactDOM.createRoot(element).render(
    <AppDependenciesProvider value={dependencies}>
      <Component />
    </AppDependenciesProvider>,
  );
}
