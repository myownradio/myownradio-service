import { UserResource } from "@myownradio/domain/resources/UserResource"
import React, { createContext } from "react"
import { Redirect } from "react-router-dom"
import { config } from "~/config"
import { AuthenticationState } from "~/modules/Authentication"
import { useResource } from "~/utils/suspense2"
import { useAuthenticationModel } from "../use/useAuthenticationModel"

export const AuthenticatedUserContext = createContext<null | UserResource>(null)

export const AuthenticatedUserProvider: React.FC = ({ children }) => {
  const authModel = useAuthenticationModel()
  const authState = useResource(authModel.authenticationState)
  const authUser = useResource(authModel.user)

  if (authState === AuthenticationState.AUTHENTICATED) {
    return <AuthenticatedUserContext.Provider value={authUser}>{children}</AuthenticatedUserContext.Provider>
  }

  return <Redirect to={config.routes.login} />
}
