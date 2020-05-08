import { validate as isValidEmail } from "email-validator"
import { useCallback } from "react"
import { useHistory } from "react-router-dom"

import { IErrorMessage } from "~/components/use/useErrorMessage"
import { config } from "~/config"
import { ISetter } from "~/interfaces"
import { useServices } from "~/services"

export default function useHandleSubmit(
  email: string,
  password: string,
  setErrorMessage: ISetter<IErrorMessage>,
): () => Promise<void> {
  const { authApiService } = useServices()
  const history = useHistory()

  return useCallback(async () => {
    setErrorMessage(null)

    if (!isValidEmail(email)) {
      setErrorMessage("ui_signup_validator_email_invalid_message")
      return
    }

    if (password.length < 6) {
      setErrorMessage("ui_signup_validator_password_short_message")
      return
    }

    try {
      await authApiService.signup(email, password)
      history.push(config.routes.login)
    } catch (e) {
      setErrorMessage("api_error")
    }
  }, [email, password, authApiService, setErrorMessage, history])
}
