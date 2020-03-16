import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppDependencies, AppDependenciesProvider } from "./dependencies";
import Main from "~/components/Main";

export default function render(element: HTMLElement | null, dependencies: AppDependencies): void {
  ReactDOM.render(
    <AppDependenciesProvider value={dependencies}>
      <Main />
    </AppDependenciesProvider>,
    element,
  );
}
