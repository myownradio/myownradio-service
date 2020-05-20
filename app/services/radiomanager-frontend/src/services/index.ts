import { createContext, useContext } from "react"
import { config } from "~/config"
import { AudioUploaderApiService, createAudioUploaderApiService } from "~/services/api/AudioUploaderApiService"
import { AuthApiService, createAuthApiService } from "~/services/api/AuthApiService"
import { createRadioManagerApiService, RadioManagerApiService } from "~/services/api/RadioManagerApiService"
import { createTokenService, TokenService } from "~/services/api/TokenService"
import { createSessionService, SessionService } from "~/services/session/SessionService"
import { createStorageService, StorageService } from "~/services/storage/StorageService"
import { createLockManager } from "~/services/utils/LockManager"
import { SchedulerApiService } from "~/services/api/SchedulerApiService"

export interface Services {
  readonly authApiService: AuthApiService
  readonly storageService: StorageService
  readonly sessionService: SessionService
  readonly tokenService: TokenService
  readonly audioUploaderApiService: AudioUploaderApiService
  readonly radioManagerApiService: RadioManagerApiService
  readonly schedulerApiService: SchedulerApiService
}

export function createServices(): Services {
  const refreshTokenLockManager = createLockManager()

  const storageService = createStorageService()
  const tokenService = createTokenService(config.authApiUrl)
  const sessionService = createSessionService(storageService, tokenService, refreshTokenLockManager)
  const authApiService = createAuthApiService(config.authApiUrl, sessionService)
  const audioUploaderApiService = createAudioUploaderApiService(config.audioUploaderApiUrl, sessionService)
  const radioManagerApiService = createRadioManagerApiService(config.radioManagerApiUrl, sessionService)
  const schedulerApiService = new SchedulerApiService(config.schedulerApiUrl, sessionService)

  return {
    authApiService,
    storageService,
    sessionService,
    tokenService,
    audioUploaderApiService,
    radioManagerApiService,
    schedulerApiService,
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
