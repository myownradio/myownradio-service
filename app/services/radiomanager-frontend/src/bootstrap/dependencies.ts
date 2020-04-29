import { createContext, useContext } from "react"
import { IConfig } from "~/config"
import { createAudioUploaderService, AudioUploaderService } from "~/root/services/api/AudioUploaderService"
import { createAuthService, AuthService } from "~/root/services/api/AuthService"
import { createLockManager } from "~/root/services/utils/LockManager"
import { createRadioManagerService, RadioManagerService } from "~/root/services/api/RadioManagerService"
import { createSessionService, SessionService } from "~/root/services/session/SessionService"
import { createStorageService, StorageService } from "~/root/services/storage/StorageService"
import { createTokenService, TokenService } from "~/root/services/api/TokenService"
import { createLoggerService, LoggerService } from "~/services/logger/LoggerService"

export type AppDependencies = {
  authApiService: AuthService
  storageService: StorageService
  sessionService: SessionService
  tokenService: TokenService
  audioUploaderService: AudioUploaderService
  radioManagerService: RadioManagerService
  loggerService: LoggerService
}

class AppDependenciesError extends Error {}

const appDependenciesContext = createContext<AppDependencies | null>(null)

export const AppDependenciesProvider = appDependenciesContext.Provider

export function createDependencies(config: IConfig): AppDependencies {
  const loggerService = createLoggerService()
  const refreshTokenLockManager = createLockManager("refreshToken", loggerService)
  const storageService = createStorageService()
  const tokenService = createTokenService(config.authApiUrl)
  const sessionService = createSessionService(storageService, tokenService, loggerService, refreshTokenLockManager)
  const authApiService = createAuthService(config.authApiUrl, sessionService)
  const audioUploaderService = createAudioUploaderService(config.audioUploaderUrl, sessionService)
  const radioManagerService = createRadioManagerService(config.radioManagerUrl, sessionService)

  return {
    authApiService,
    storageService,
    sessionService,
    tokenService,
    audioUploaderService,
    radioManagerService,
    loggerService,
  }
}

export function useDependencies(): AppDependencies {
  const value = useContext(appDependenciesContext)
  if (value === null) {
    throw new AppDependenciesError("You probably forgot to put <AppDependenciesProvider>.")
  }
  return value
}
