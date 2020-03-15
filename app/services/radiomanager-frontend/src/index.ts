import render from "./render";
import config from "./config";
import { createDependencies } from "./common/reactAppDependencies";

const dependencies = createDependencies(config);
const rootElement = document.getElementById("root");

render(rootElement, dependencies);
