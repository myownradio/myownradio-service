import { createContext, useContext } from "react";
import { AuthServer } from "../api/authServer";
import { IConfig } from "../interfaces";

export type IReactAppDependencies = {
  authServer: AuthServer;
};

class ReactAppDependenciesError extends Error {}

const reactAppDependenciesContext = createContext<IReactAppDependencies | null>(null);

export const ReactAppDependenciesProvider = reactAppDependenciesContext.Provider;

export function createDependencies(config: IConfig): IReactAppDependencies {
  const authServer = new AuthServer(config.authServerUrl);
  return { authServer };
}

export function useDependencies(): IReactAppDependencies {
  const value = useContext(reactAppDependenciesContext);
  if (value === null) {
    throw new ReactAppDependenciesError(
      "You probably forgot to put <ReactAppDependenciesProvider>.",
    );
  }
  return value;
}
