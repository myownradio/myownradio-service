import { createContext, useContext } from "react";

import { IConfig } from "~/config";
import { AudioUploaderService } from "~/services/audioUploaderService";
import { AuthApiService } from "~/services/authApiService";
import { BasicSessionService, SessionService } from "~/services/sessionService";
import { createStorageService, StorageService } from "~/services/storageService";
import { TokenService } from "~/services/tokenService";

export type AppDependencies = {
  authApiService: AuthApiService;
  storageService: StorageService;
  sessionService: SessionService;
  tokenService: TokenService;
  audioUploaderService: AudioUploaderService;
};

class AppDependenciesError extends Error {}

const appDependenciesContext = createContext<AppDependencies | null>(null);

export const AppDependenciesProvider = appDependenciesContext.Provider;

export function createDependencies(config: IConfig): AppDependencies {
  const storageService = createStorageService();
  const tokenService = new TokenService(config.authApiUrl);
  const sessionService = new BasicSessionService(storageService, tokenService);
  const authApiService = new AuthApiService(config.authApiUrl, sessionService);
  const audioUploaderService = new AudioUploaderService(config.audioUploaderUrl, sessionService);

  return { authApiService, storageService, sessionService, tokenService, audioUploaderService };
}

export function useDependencies(): AppDependencies {
  const value = useContext(appDependenciesContext);
  if (value === null) {
    throw new AppDependenciesError("You probably forgot to put <AppDependenciesProvider>.");
  }
  return value;
}
