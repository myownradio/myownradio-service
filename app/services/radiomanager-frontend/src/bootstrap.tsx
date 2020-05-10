import * as React from "react"
import * as ReactDOM from "react-dom"
import {} from "react-dom/experimental"
import { createRootModel, RootModelContext } from "~/model"
import { createServices, ServicesContext } from "./services"

export default function bootstrap(Component: React.ComponentType): void {
  const services = createServices()
  const rootModel = createRootModel(services)

  console.log(1)
  rootModel.authenticationModel.tryAuthentication()
  console.log(2)

  Object.assign(window, { rootModel })

  const rootElement = document.getElementById("root") as HTMLElement

  ReactDOM.createRoot(rootElement).render(
    <RootModelContext.Provider value={rootModel}>
      <ServicesContext.Provider value={services}>
        <Component />
      </ServicesContext.Provider>
    </RootModelContext.Provider>,
  )
}
