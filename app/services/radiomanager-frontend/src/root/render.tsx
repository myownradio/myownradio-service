import * as React from "react"
import * as ReactDOM from "react-dom"
import {} from "react-dom/experimental"

import { Services, ServicesContext } from "~/services"

export default function render(element: HTMLElement, services: Services, Component: React.ComponentType): void {
  ReactDOM.createRoot(element).render(
    <ServicesContext.Provider value={services}>
      <Component />
    </ServicesContext.Provider>,
  )
}
