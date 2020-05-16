import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import { mapLoginErrorToUserMessage } from "~/services/api/errors/mapErrorToUserMessage"
import { isEmptyObject } from "~/utils/fn"
import getText from "~/utils/getText"

interface LoginFormFields {
  email: string
  password: string
}

type Errors = {
  [K in keyof LoginFormFields]?: string
}

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

function validateFields(fields: LoginFormFields): [boolean, Errors] {
  const errors: Errors = {}

  if (!fields.email) {
    errors.email = getText("Email should be specified.")
  }

  if (!fields.password) {
    errors.password = getText("Password should be specified.")
  }

  return [isEmptyObject(errors), errors]
}

export function useLogin(email: string, password: string): [EventHandler, Errors, boolean] {
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleLoginClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const [isValid, errors] = validateFields({ email, password })

    if (!email) {
      errors.email = getText("Email should be specified.")
    }

    if (!password) {
      errors.password = getText("Password should be specified.")
    }

    if (!isValid) {
      setErrors(errors)
      return
    }

    setErrors({})
    setBusy(true)

    authenticationModel
      .login(email, password)
      .then(
        () => {
          history.push(config.routes.home)
        },
        error => {
          setErrors(mapLoginErrorToUserMessage(error))
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleLoginClick, errors, busy]
}
