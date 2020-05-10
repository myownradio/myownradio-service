import { createContext } from "react"
import { AuthenticationModel } from "./AuthenticationModel"

export const AuthenticationModelContext = createContext<AuthenticationModel | null>(null)
