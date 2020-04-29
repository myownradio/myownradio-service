import { createServices } from "~/services"
import render from "./render"

export default function bootstrap(Component: React.ComponentType): void {
  const services = createServices()
  const rootElement = document.getElementById("root") as HTMLElement

  render(rootElement, services, Component)
}
