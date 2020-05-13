import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import getText from "~/utils/getText"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

interface Errors {
  [key: string]: string
}

export function useSignup(email: string, password: string): [EventHandler, Errors, boolean] {
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleSignupClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    const errors: Errors = {}

    if (!email) {
      errors.email = getText("Email should be specified.")
    }

    if (!password) {
      errors.password = getText("Password should be specified.")
    } else if (password.length < 6) {
      errors.password = getText("Your password should be at least 6 characters long.")
    }

    if (Object.keys(errors).length > 0) {
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
          setErrors({ root: getText(error.message) })
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleSignupClick, errors, busy]
}
