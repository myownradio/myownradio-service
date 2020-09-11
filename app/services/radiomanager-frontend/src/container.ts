import { Container } from "inversify"
import { createContext } from "react"
import { RadioManagerStore, RadioManagerStoreImpl } from "~/store/RadioManagerStore"
import { EnvType } from "./container.types"
import { env } from "./env"

export function createContainer(): Container {
  const container = new Container()

  container.bind(EnvType).toConstantValue(env())

  container
    .bind(RadioManagerStore)
    .to(RadioManagerStoreImpl)
    .inSingletonScope()

  return container
}

export const ContainerContext = createContext<Container | null>(null)
