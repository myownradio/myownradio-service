import * as React from "react"
import { Redirect } from "react-router-dom"

import { config } from "~/config"
import LoggedInUserProvider from "~/modules/LoggedInUser/LoggedInUserProvider"

import LoginForm from "./components/LoginForm"

const LoginPage: React.FC = () => {
  return (
    <LoggedInUserProvider fallback={<LoginForm />}>
      <Redirect to={config.routes.home} />
    </LoggedInUserProvider>
  )
}

LoginPage.propTypes = {}

export default LoginPage
