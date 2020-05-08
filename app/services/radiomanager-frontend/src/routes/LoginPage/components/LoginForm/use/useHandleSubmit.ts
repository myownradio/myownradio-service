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
  const { authApiService, sessionService } = useServices()
  const history = useHistory()

  return useCallback(async () => {
    setErrorMessage(null)

    if (!email || !password) {
      setErrorMessage("ui_login_validator_empty_message")
      return
    }

    try {
      const { access_token, refresh_token } = await authApiService.login(email, password)
      sessionService.saveTokens(access_token, refresh_token)
      history.push(config.routes.home)
    } catch (e) {
      setErrorMessage("api_error")
    }
  }, [email, password, history, authApiService, sessionService, setErrorMessage])
}
