import * as React from "react"
import * as ReactDOM from "react-dom"
import {} from "react-dom/experimental"
import { createServices, ServicesContext } from "~/services"

export default function bootstrap(Component: React.ComponentType): void {
  const services = createServices()
  const rootElement = document.getElementById("root") as HTMLElement

  ReactDOM.createRoot(rootElement).render(
    <ServicesContext.Provider value={services}>
      <Component />
    </ServicesContext.Provider>,
  )
}
