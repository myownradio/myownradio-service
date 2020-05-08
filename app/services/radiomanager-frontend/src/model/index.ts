import { createContext, useContext } from "react"
import { AudioFileUploaderService, createAudioFileUploaderService } from "~/model/AudioFileUploaderService"
import { RadioChannelService } from "~/model/RadioChannelService"
import { createRadioManagerService, RadioManagerService } from "~/model/RadioManagerService"
import { Services } from "~/services"

export interface Model {
  readonly radioManagerService: RadioManagerService
  readonly audioFileUploaderService: AudioFileUploaderService
}

export function createRootModel(services: Services): Model {
  const audioFileUploaderService = createAudioFileUploaderService(
    services.radioManagerApiService,
    services.audioUploaderApiService,
  )
  const radioManagerService = createRadioManagerService(services.radioManagerApiService, audioFileUploaderService)
  return { radioManagerService, audioFileUploaderService }
}

export const RootModelContext = createContext<Model | null>(null)

export function useRootModel(): Model {
  const model = useContext(RootModelContext)

  if (model === null) {
    throw new TypeError("You probable forgot to put <RootModelContext.Provider> into your application")
  }

  return model
}

export const RadioChannelContext = createContext<RadioChannelService | null>(null)

export function useRadioChannel(): RadioChannelService {
  const radioChannel = useContext(RadioChannelContext)

  if (radioChannel === null) {
    throw new TypeError("You probable forgot to put <RadioChannelContext.Provider> into your application")
  }

  return radioChannel
}
