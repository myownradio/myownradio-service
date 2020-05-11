import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import gettext from "~/utils/gettext"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

export function useSignup(email: string, password: string): [EventHandler, string | null, boolean] {
  const [error, setError] = useState<null | string>(null)
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleSignupClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!email) {
      setError(gettext("Email should be specified."))
      return
    }

    if (!password) {
      setError(gettext("Password should be specified."))
      return
    }

    if (password.length < 6) {
      setError(gettext("Your password should be at least 6 characters long."))
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
          setError(gettext(error.message))
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleSignupClick, error, busy]
}
