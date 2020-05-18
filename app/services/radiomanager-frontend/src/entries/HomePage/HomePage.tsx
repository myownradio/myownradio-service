import React from "react"
import { Redirect } from "react-router-dom"
import { config } from "~/config"
import { AuthenticationState, useAuthenticationModel } from "~/modules/Authentication"
import { useResource } from "~/utils/suspense2"

const HomePage: React.FC = () => {
  const authenticationModel = useAuthenticationModel()
  const authenticationState = useResource(authenticationModel.authenticationState)

  if (authenticationState === AuthenticationState.AUTHENTICATED) {
    return <Redirect to={config.routes.myChannels} />
  }

  return <Redirect to={config.routes.login} />
}

export default HomePage
