import * as React from "react"
import * as ReactDOM from "react-dom"
import {} from "react-dom/experimental"
import { RadioChannelModel } from "~/modules/RadioManager/RadioChannelModel/RadioChannelModel"
import { AudioFileUploaderModel, AudioFileUploaderModelContext } from "~/modules/AudioFileUploader"
import { AuthenticationModel, AuthenticationModelContext } from "~/modules/Authentication"
import { RadioManagerModel, RadioManagerModelContext } from "~/modules/RadioManager"
import { createServices, ServicesContext } from "./services"

export default function bootstrap(Component: React.ComponentType): void {
  const services = createServices()

  const authenticationModel = new AuthenticationModel(services.authApiService, services.sessionService)
  const audioFileUploaderModel = new AudioFileUploaderModel(
    services.radioManagerApiService,
    services.audioUploaderApiService,
    authenticationModel,
  )
  const radioManagerModel = new RadioManagerModel(
    services.radioManagerApiService,
    authenticationModel,
    channelId => new RadioChannelModel(channelId, services.radioManagerApiService, audioFileUploaderModel),
  )

  authenticationModel.tryAuthentication()

  const model = { authenticationModel, audioFileUploaderModel, radioManagerModel }
  Object.assign(window, { model })

  const rootElement = document.getElementById("root") as HTMLElement

  ReactDOM.createRoot(rootElement).render(
    <AuthenticationModelContext.Provider value={authenticationModel}>
      <AudioFileUploaderModelContext.Provider value={audioFileUploaderModel}>
        <RadioManagerModelContext.Provider value={radioManagerModel}>
          <ServicesContext.Provider value={services}>
            <Component />
          </ServicesContext.Provider>
        </RadioManagerModelContext.Provider>
      </AudioFileUploaderModelContext.Provider>
    </AuthenticationModelContext.Provider>,
  )
}