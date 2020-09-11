import { Container } from "inversify"
import { createContext } from "react"
import { EnvType } from "./container.types"
import { env } from "./env"

export function createContainer(): Container {
  const container = new Container()

  container.bind(EnvType).toConstantValue(env())

  return container
}

export const ContainerContext = createContext<Container | null>(null)
