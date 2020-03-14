import * as React from "react";
import * as ReactDOM from "react-dom";
import { IReactAppDependencies, ReactAppDependenciesProvider } from "./common/reactAppDependencies";
import App from "./App";

export default function render(
  element: HTMLElement | null,
  dependencies: IReactAppDependencies,
): void {
  ReactDOM.render(
    <ReactAppDependenciesProvider value={dependencies}>
      <App />
    </ReactAppDependenciesProvider>,
    element,
  );
}
