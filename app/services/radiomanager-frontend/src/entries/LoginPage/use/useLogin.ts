import { FormEvent, useState } from "react"
import { useHistory } from "react-router-dom"
import { config } from "~/config"
import { useAuthenticationModel } from "~/model"
import gettext from "~/utils/gettext"

type EventHandler = (event: FormEvent<HTMLFormElement>) => void

export function useLogin(email: string, password: string): [EventHandler, string | null] {
  const [error, setError] = useState<null | string>(null)

  const authenticationModel = useAuthenticationModel()
  const history = useHistory()

  function handleLoginClick(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (!email) {
      setError(gettext("Email should be specified"))
      return
    }

    if (!password) {
      setError(gettext("Password should be specified"))
      return
    }

    setError(null)

    authenticationModel.login(email, password).then(
      () => {
        history.push(config.routes.home)
      },
      error => {
        setError(gettext(error.message))
      },
    )
  }

  return [handleLoginClick, error]
}
