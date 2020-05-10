import React from "react"
import { Redirect } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/model"
import { AuthenticationState } from "~/model/AuthenticationModel"
import { useResource } from "~/utils/suspense2"

const Authenticated: React.FC = ({ children }) => {
  const authenticatedModel = useAuthenticationModel()
  const authenticationState = useResource(authenticatedModel.authenticationState)

  if (authenticationState === AuthenticationState.AUTHENTICATED) {
    return <>{children}</>
  }

  return <Redirect to={config.routes.login} />
}

export default Authenticated
