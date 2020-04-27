import * as React from "react"
import { useState } from "react"

import useErrorMessage from "~/components/use/useErrorMessage"

import LoginForm from "./LoginForm"
import useHandleSubmit from "./use/useHandleSubmit"

const LoginFormContainer: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useErrorMessage()

  const handleSubmit = useHandleSubmit(email, setEmail, password, setPassword, setErrorMessage)

  return (
    <LoginForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onLoginClicked={handleSubmit}
      errorMessage={errorMessage}
    />
  )
}

export default LoginFormContainer
