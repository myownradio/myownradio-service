import { createContext, useContext } from "react"
import { config } from "~/config"
import { AudioUploaderApiService, createAudioUploaderService } from "~/services/api/AudioUploaderApiService"
import { AuthApiService, createAuthService } from "~/services/api/AuthApiService"
import { createRadioManagerService, RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { createTokenService, TokenService } from "~/services/api/TokenService"
import { createSessionService, SessionService } from "~/services/session/SessionService"
import { createStorageService, StorageService } from "~/services/storage/StorageService"
import { createLockManager } from "~/services/utils/LockManager"

export interface Services {
  readonly authApiService: AuthApiService
  readonly storageService: StorageService
  readonly sessionService: SessionService
  readonly tokenService: TokenService
  readonly audioUploaderApiService: AudioUploaderApiService
  readonly radioManagerApiService: RadioManagerApiService
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
    audioUploaderApiService: audioUploaderService,
    radioManagerApiService: radioManagerService,
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
