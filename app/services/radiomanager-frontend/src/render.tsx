import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppDependencies, AppDependenciesProvider } from "./common/appDependencies";
import App from "./App";

export default function render(element: HTMLElement | null, dependencies: AppDependencies): void {
  ReactDOM.render(
    <AppDependenciesProvider value={dependencies}>
      <App />
    </AppDependenciesProvider>,
    element,
  );
}
