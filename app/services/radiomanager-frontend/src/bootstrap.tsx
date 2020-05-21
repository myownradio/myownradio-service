import React from "react"
import { unstable_createRoot } from "react-dom"
import {} from "react-dom/experimental"
import { AudioFileUploaderModel, AudioFileUploaderModelContext } from "~/modules/AudioFileUploader"
import { AuthenticationModel, AuthenticationModelContext } from "~/modules/Authentication"
import { RadioManagerModel, RadioManagerModelContext } from "~/modules/RadioManager"
import { RadioChannelModel } from "~/modules/RadioManager/RadioChannelModel/RadioChannelModel"
import { SchedulerModel } from "~/modules/RadioManager/SchedulerModel"
import { createServices, ServicesContext } from "./services"

export default function bootstrap(Component: React.ComponentType, rootClass?: string): void {
  const services = createServices()

  const authenticationModel = new AuthenticationModel(services.authApiService, services.sessionService)
  const audioFileUploaderModel = new AudioFileUploaderModel(
    services.radioManagerApiService,
    services.audioUploaderApiService,
    authenticationModel,
  )
  const provideSchedulerModel = (channelId: string, radioChannelModel: RadioChannelModel) =>
    new SchedulerModel(channelId, radioChannelModel, services.schedulerApiService)
  const radioManagerModel = new RadioManagerModel(
    services.radioManagerApiService,
    authenticationModel,
    channelId =>
      new RadioChannelModel(channelId, services.radioManagerApiService, audioFileUploaderModel, provideSchedulerModel),
  )

  authenticationModel.tryAuthentication()

  const model = { authenticationModel, audioFileUploaderModel, radioManagerModel }
  Object.assign(window, { model })

  const rootElement = document.getElementById("root") as HTMLElement

  rootClass && rootElement.classList.add(rootClass)

  unstable_createRoot(rootElement).render(
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
