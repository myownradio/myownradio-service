import { Container } from "inversify"
import { createContext } from "react"
import { LocalStorageService, MemoryStorageService, StorageService } from "~/services/storage/StorageService"
import { AuthenticationStore, AuthenticationStoreImpl } from "~/store/AuthenticationStore"
import { RadioChannelsStore, RadioChannelsStoreImpl } from "~/store/RadioChannelsStore"
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
  container
    .bind(AuthenticationStore)
    .to(AuthenticationStoreImpl)
    .inSingletonScope()
  container
    .bind(RadioChannelsStore)
    .to(RadioChannelsStoreImpl)
    .inSingletonScope()

  container.bind(Container).toConstantValue(container)

  container.bind(StorageService).toDynamicValue(() => {
    try {
      const test = "__storage_test__"
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return new LocalStorageService()
    } catch {
      return new MemoryStorageService()
    }
  })

  return container
}

export const ContainerContext = createContext<Container | null>(null)
