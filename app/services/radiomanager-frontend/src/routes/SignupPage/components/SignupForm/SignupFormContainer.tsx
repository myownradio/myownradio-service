import * as React from "react"
import { useState } from "react"

import useErrorMessage from "~/components/use/useErrorMessage"

import SignupForm from "./SignupForm"
import useHandleSubmit from "./use/useHandleSubmit"

const SignupFormContainer: React.FC = () => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [errorMessage, setErrorMessage] = useErrorMessage()

  const handleSubmit = useHandleSubmit(email, setEmail, password, setPassword, setErrorMessage)

  return (
    <SignupForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSignupClicked={handleSubmit}
      errorMessage={errorMessage}
    />
  )
}

export default SignupFormContainer
