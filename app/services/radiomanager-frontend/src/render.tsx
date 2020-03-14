import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";

export default function render(element: HTMLElement | null): void {
  ReactDOM.render(<App />, element);
}
