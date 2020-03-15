import { createContext, useContext } from "react";
import { createStorageService, StorageService } from "./services/storageService";
import { AuthServer } from "../api/authServer";
import { IConfig } from "../interfaces";

export type IAppDependencies = {
  authServer: AuthServer;
  storageService: StorageService;
};

class AppDependenciesError extends Error {}

const appDependenciesContext = createContext<IAppDependencies | null>(null);

export const AppDependenciesProvider = appDependenciesContext.Provider;

export function createDependencies(config: IConfig): IAppDependencies {
  const storageService = createStorageService();
  const authServer = new AuthServer(config.authServerUrl, storageService);
  return { authServer, storageService };
}

export function useDependencies(): IAppDependencies {
  const value = useContext(appDependenciesContext);
  if (value === null) {
    throw new AppDependenciesError("You probably forgot to put <AppDependenciesProvider>.");
  }
  return value;
}
