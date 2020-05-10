import { createContext } from "react"
import { RadioManagerModel } from "./RadioManagerModel"

export const RadioManagerModelContext = createContext<RadioManagerModel | null>(null)
