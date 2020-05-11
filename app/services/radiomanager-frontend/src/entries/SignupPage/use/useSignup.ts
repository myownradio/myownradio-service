import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import getText from "~/utils/getText"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

export function useSignup(email: string, password: string): [EventHandler, string | null, boolean] {
  const [error, setError] = useState<null | string>(null)
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleSignupClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!email) {
      setError(getText("Email should be specified."))
      return
    }

    if (!password) {
      setError(getText("Password should be specified."))
      return
    }

    if (password.length < 6) {
      setError(getText("Your password should be at least 6 characters long."))
    }

    setError(null)
    setBusy(true)

    authenticationModel
      .signup(email, password)
      .then(
        () => {
          history.push(config.routes.login)
        },
        error => {
          setError(getText(error.message))
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleSignupClick, error, busy]
}
