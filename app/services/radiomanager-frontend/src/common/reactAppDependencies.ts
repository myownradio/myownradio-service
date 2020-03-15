import { createContext, useContext } from "react";
import { createStorageService, StorageService } from "./services/storageService";
import { AuthServer } from "../api/authServer";
import { IConfig } from "../interfaces";

export type IReactAppDependencies = {
  authServer: AuthServer;
  storageService: StorageService,
};

class ReactAppDependenciesError extends Error {}

const reactAppDependenciesContext = createContext<IReactAppDependencies | null>(null);

export const ReactAppDependenciesProvider = reactAppDependenciesContext.Provider;

export function createDependencies(config: IConfig): IReactAppDependencies {
  const storageService = createStorageService();
  const authServer = new AuthServer(config.authServerUrl, storageService);
  return { authServer, storageService };
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
