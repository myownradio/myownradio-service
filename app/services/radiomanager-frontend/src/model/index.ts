import { createContext, useContext } from "react"
import { AudioFileUploaderModel, createAudioFileUploaderModel } from "~/model/AudioFileUploaderModel"
import { RadioChannelModel } from "~/model/RadioChannelModel"
import { createRadioManagerModel, RadioManagerModel } from "~/model/RadioManagerModel"
import { Services } from "~/services"

export interface Model {
  readonly radioManagerService: RadioManagerModel
  readonly audioFileUploaderService: AudioFileUploaderModel
}

export function createRootModel(services: Services): Model {
  const audioFileUploaderService = createAudioFileUploaderModel(
    services.radioManagerApiService,
    services.audioUploaderApiService,
  )
  const radioManagerService = createRadioManagerModel(services.radioManagerApiService, audioFileUploaderService)
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

export const RadioChannelContext = createContext<RadioChannelModel | null>(null)

export function useRadioChannel(): RadioChannelModel {
  const radioChannel = useContext(RadioChannelContext)

  if (radioChannel === null) {
    throw new TypeError("You probable forgot to put <RadioChannelContext.Provider> into your application")
  }

  return radioChannel
}
