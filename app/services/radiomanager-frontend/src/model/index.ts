import { createContext, useContext } from "react"
import { AudioFileUploaderModel, createAudioFileUploaderModel } from "~/model/AudioFileUploaderModel"
import { AuthenticationModel } from "~/model/AuthenticationModel"
import { createRadioChannelModel, RadioChannelModel } from "~/model/RadioChannelModel"
import { createRadioManagerModel, RadioManagerModel } from "~/model/RadioManagerModel"
import { Services } from "~/services"

export interface Model {
  readonly authenticationModel: AuthenticationModel
  readonly radioManagerModel: RadioManagerModel
  readonly audioFileUploaderModel: AudioFileUploaderModel
}

export function createRootModel(services: Services): Model {
  const authenticationModel = new AuthenticationModel(services.authApiService, services.sessionService)

  const audioFileUploaderModel = createAudioFileUploaderModel(
    services.radioManagerApiService,
    services.audioUploaderApiService,
  )

  const getRadioChannelModel = (channelId: string): RadioChannelModel =>
    createRadioChannelModel(channelId, services.radioManagerApiService, audioFileUploaderModel)

  const radioManagerModel = createRadioManagerModel(services.radioManagerApiService, getRadioChannelModel)

  return { radioManagerModel, audioFileUploaderModel, authenticationModel }
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
