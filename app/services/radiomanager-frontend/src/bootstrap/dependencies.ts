import { createContext, useContext } from "react";
import { IConfig } from "~/config";
import { AuthApiService } from "~/services/authApiService";
import { BasicSessionService, SessionService } from "~/services/sessionService";
import { createStorageService, StorageService } from "~/services/storageService";

export type AppDependencies = {
  authApiService: AuthApiService;
  storageService: StorageService;
  sessionService: SessionService;
};

class AppDependenciesError extends Error {}

const appDependenciesContext = createContext<AppDependencies | null>(null);

export const AppDependenciesProvider = appDependenciesContext.Provider;

export function createDependencies(config: IConfig): AppDependencies {
  const storageService = createStorageService();
  const sessionService = new BasicSessionService(storageService);
  const authApiService = new AuthApiService(config.authApiUrl, sessionService);

  sessionService.setAuthApiClient(authApiService);

  return { authApiService, storageService, sessionService };
}

export function useDependencies(): AppDependencies {
  const value = useContext(appDependenciesContext);
  if (value === null) {
    throw new AppDependenciesError("You probably forgot to put <AppDependenciesProvider>.");
  }
  return value;
}
