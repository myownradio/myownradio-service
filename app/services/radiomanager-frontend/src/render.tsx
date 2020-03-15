import * as React from "react";
import * as ReactDOM from "react-dom";
import { IAppDependencies, AppDependenciesProvider } from "./common/reactAppDependencies";
import App from "./App";

export default function render(element: HTMLElement | null, dependencies: IAppDependencies): void {
  ReactDOM.render(
    <AppDependenciesProvider value={dependencies}>
      <App />
    </AppDependenciesProvider>,
    element,
  );
}
