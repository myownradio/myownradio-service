import { createContext, useContext } from "react"
import { config } from "~/config"
import { AudioUploaderService, createAudioUploaderService } from "~/root/services/api/AudioUploaderService"
import { AuthService, createAuthService } from "~/root/services/api/AuthService"
import { createRadioManagerService, RadioManagerService } from "~/root/services/api/RadioManagerService"
import { createTokenService, TokenService } from "~/root/services/api/TokenService"
import { createSessionService, SessionService } from "~/root/services/session/SessionService"
import { createStorageService, StorageService } from "~/root/services/storage/StorageService"
import { createLockManager } from "~/root/services/utils/LockManager"
import { createLoggerService, LoggerService } from "~/services/logger/LoggerService"

export interface Services {
  readonly authApiService: AuthService
  readonly storageService: StorageService
  readonly sessionService: SessionService
  readonly tokenService: TokenService
  readonly audioUploaderService: AudioUploaderService
  readonly radioManagerService: RadioManagerService
  readonly loggerService: LoggerService
}

export function createServices(): Services {
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

export const ServicesContext = createContext<Services | null>(null)

export function useServices(): Services {
  const services = useContext(ServicesContext)

  if (services === null) {
    throw new TypeError("You probable forgot to put <ServiceContext.Provider> into your application")
  }

  return services
}
