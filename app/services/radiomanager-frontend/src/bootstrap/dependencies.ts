import { createContext, useContext } from "react";
import { createStorageService, StorageService } from "~/services/storageService";
import { AuthApiService } from "~/services/authApiService";
import { IConfig } from "~/config";
import { BasicSessionService, SessionService } from "~/services/sessionService";

export type AppDependencies = {
  authApiClient: AuthApiService;
  storageService: StorageService;
  sessionService: SessionService;
};

class AppDependenciesError extends Error {}

const appDependenciesContext = createContext<AppDependencies | null>(null);

export const AppDependenciesProvider = appDependenciesContext.Provider;

export function createDependencies(config: IConfig): AppDependencies {
  const storageService = createStorageService();
  const sessionService = new BasicSessionService(storageService);
  const authApiClient = new AuthApiService(config.authApiUrl, sessionService);

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
