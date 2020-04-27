import * as React from "react"
import { Redirect } from "react-router-dom"

import { config } from "~/config"
import LoggedInUserProvider from "~/modules/LoggedInUser/LoggedInUserProvider"

import SignupForm from "./components/SignupForm"

const SignupPage: React.FC = () => {
  return (
    <LoggedInUserProvider fallback={<SignupForm />}>
      <Redirect to={config.routes.home} />
    </LoggedInUserProvider>
  )
}

export default SignupPage
