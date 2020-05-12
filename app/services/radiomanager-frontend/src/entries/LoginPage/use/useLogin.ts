import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import { mapLoginErrorToUserMessage } from "~/services/api/errors/mapErrorToUserMessage"
import getText from "~/utils/getText"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

interface Errors {
  [key: string]: string
}

export function useLogin(email: string, password: string): [EventHandler, Errors, boolean] {
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleLoginClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const errors: Errors = {}

    if (!email) {
      errors.email = getText("Email should be specified.")
    }

    if (!password) {
      errors.password = getText("Password should be specified.")
    }

    if (Object.keys(errors).length > 0) {
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
          const userMessage = mapLoginErrorToUserMessage(error)
          setErrors({ root: userMessage })
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleLoginClick, errors, busy]
}
