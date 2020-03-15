import render from "./render";
import config from "./config";
import { createDependencies } from "./common/appDependencies";

const dependencies = createDependencies(config);
const rootElement = document.getElementById("root");

render(rootElement, dependencies);
