import { createContext, useContext } from "react"
import { config } from "~/config"
import { AudioUploaderService, createAudioUploaderService } from "~/services/api/AudioUploaderService"
import { AuthService, createAuthService } from "~/services/api/AuthService"
import { createRadioManagerService, RadioManagerService } from "~/services/api/RadioManagerService"
import { createTokenService, TokenService } from "~/services/api/TokenService"
import { createSessionService, SessionService } from "~/services/session/SessionService"
import { createStorageService, StorageService } from "~/services/storage/StorageService"
import { createLockManager } from "~/services/utils/LockManager"

export interface Services {
  readonly authApiService: AuthService
  readonly storageService: StorageService
  readonly sessionService: SessionService
  readonly tokenService: TokenService
  readonly audioUploaderService: AudioUploaderService
  readonly radioManagerService: RadioManagerService
}

export function createServices(): Services {
  const refreshTokenLockManager = createLockManager("refreshToken")
  const storageService = createStorageService()
  const tokenService = createTokenService(config.authApiUrl)
  const sessionService = createSessionService(storageService, tokenService, refreshTokenLockManager)
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
