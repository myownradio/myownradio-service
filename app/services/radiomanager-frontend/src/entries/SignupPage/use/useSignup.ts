import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import { mapSignupErrorToUserMessage } from "~/services/api/errors/mapErrorToUserMessage"
import { isEmptyObject } from "~/utils/fn"
import getText from "~/utils/getText"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

interface SignupFormFields {
  email: string
  password: string
}

type Errors = {
  [K in keyof SignupFormFields]?: string
}

function validateFields(fields: SignupFormFields): [boolean, Errors] {
  const errors: Errors = {}

  if (!fields.email) {
    errors.email = getText("Email should be specified.")
  }

  if (!fields.password) {
    errors.password = getText("Password should be specified.")
  } else if (fields.password.length < 6) {
    errors.password = getText("Your password should be at least 6 characters long.")
  }

  return [isEmptyObject(errors), errors]
}

export function useSignup(email: string, password: string): [EventHandler, Errors, boolean] {
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleSignupClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const [isValid, errors] = validateFields({ email, password })

    if (!isValid) {
      setErrors(errors)
      return
    }

    setErrors({})
    setBusy(true)

    authenticationModel
      .signup(email, password)
      .then(
        () => {
          history.push(config.routes.login)
        },
        error => {
          setErrors(mapSignupErrorToUserMessage(error))
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleSignupClick, errors, busy]
}
