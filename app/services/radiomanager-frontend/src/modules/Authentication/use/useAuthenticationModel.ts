import { useContext } from "react"
import { AuthenticationModel, AuthenticationModelContext } from "~/modules/Authentication"

export function useAuthenticationModel(): AuthenticationModel {
  const probablyAuthenticationModel = useContext(AuthenticationModelContext)

  if (!probablyAuthenticationModel) {
    throw new TypeError("You probable forgot to put <AuthenticationModelContext.Provider> into your application")
  }

  return probablyAuthenticationModel
}
