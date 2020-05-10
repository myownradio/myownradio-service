import { createContext } from "react"
import { AuthenticationModel } from "~/modules/Authentication"

export const AuthenticationModelContext = createContext<AuthenticationModel | null>(null)
