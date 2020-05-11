import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/modules/Authentication"
import getText from "~/utils/getText"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

export function useLogin(email: string, password: string): [EventHandler, string | null, boolean] {
  const [error, setError] = useState<null | string>(null)
  const [busy, setBusy] = useState(false)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleLoginClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!email) {
      setError(getText("Email should be specified."))
      return
    }

    if (!password) {
      setError(getText("Password should be specified."))
      return
    }

    setError(null)
    setBusy(true)

    authenticationModel
      .login(email, password)
      .then(
        () => {
          history.push(config.routes.home)
        },
        error => {
          setError(getText(error.message))
        },
      )
      .finally(() => {
        setBusy(false)
      })
  }

  return [handleLoginClick, error, busy]
}
