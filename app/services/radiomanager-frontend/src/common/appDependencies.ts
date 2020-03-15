import { createContext, useContext } from "react";
import { createStorageService, StorageService } from "./services/storageService";
import { AuthApiClient } from "../api/AuthApiClient";
import { IConfig } from "../interfaces";
import { BasicSessionService, SessionService } from "./services/sessionService";

export type AppDependencies = {
  authApiClient: AuthApiClient;
  storageService: StorageService;
  sessionService: SessionService;
};

class AppDependenciesError extends Error {}

const appDependenciesContext = createContext<AppDependencies | null>(null);

export const AppDependenciesProvider = appDependenciesContext.Provider;

export function createDependencies(config: IConfig): AppDependencies {
  const storageService = createStorageService();
  const sessionService = new BasicSessionService(storageService);
  const authApiClient = new AuthApiClient(config.authServerUrl, sessionService);

  /**
   * WARNING! We add dependency using setter because AuthApiClient and SessionService
   * both has circular dependency on each other.
   */
  sessionService.setAuthApiClient(authApiClient);

  return { authApiClient, storageService, sessionService };
}

export function useDependencies(): AppDependencies {
  const value = useContext(appDependenciesContext);
  if (value === null) {
    throw new AppDependenciesError("You probably forgot to put <AppDependenciesProvider>.");
  }
  return value;
}
