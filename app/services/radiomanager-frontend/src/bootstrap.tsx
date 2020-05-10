import * as React from "react"
import * as ReactDOM from "react-dom"
import {} from "react-dom/experimental"
import { createRootModel, RootModelContext } from "~/model"
import { AuthenticationModel } from "~/modules/Authentication"
import { AuthenticationModelContext } from "~/modules/Authentication"
import { createServices, ServicesContext } from "./services"

export default function bootstrap(Component: React.ComponentType): void {
  const services = createServices()
  const rootModel = createRootModel(services)

  const authenticationModel = new AuthenticationModel(services.authApiService, services.sessionService)

  authenticationModel.tryAuthentication()

  Object.assign(window, { rootModel })

  const rootElement = document.getElementById("root") as HTMLElement

  ReactDOM.createRoot(rootElement).render(
    <AuthenticationModelContext.Provider value={authenticationModel}>
      <RootModelContext.Provider value={rootModel}>
        <ServicesContext.Provider value={services}>
          <Component />
        </ServicesContext.Provider>
      </RootModelContext.Provider>
    </AuthenticationModelContext.Provider>,
  )
}
