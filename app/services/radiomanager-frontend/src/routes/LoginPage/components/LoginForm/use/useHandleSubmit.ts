import { useCallback } from "react";
import { useHistory } from "react-router-dom";

import { useDependencies } from "~/bootstrap/dependencies";
import { IErrorMessage } from "~/components/use/useErrorMessage";
import { config } from "~/config";
import { ISetter } from "~/interfaces";
import AbstractErrorWithLocaleKey from "~/services/errors/AbstractErrorWithLocaleKey";

export default function useHandleSubmit(
  email: string,
  setEmail: ISetter<string>,
  password: string,
  setPassword: ISetter<string>,
  setErrorMessage: ISetter<IErrorMessage>,
): () => Promise<void> {
  const { authApiService, sessionService } = useDependencies();
  const history = useHistory();

  return useCallback(async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("ui_login_validator_empty_message");
      return;
    }

    try {
      const { access_token, refresh_token } = await authApiService.login(email, password);
      sessionService.saveTokens(access_token, refresh_token);
      history.push(config.routes.home);
    } catch (e) {
      if (e instanceof AbstractErrorWithLocaleKey) {
        setErrorMessage(e.localeKey);
      } else {
        setErrorMessage("api_error");
      }
    }
  }, [email, password, history, authApiService, sessionService, setErrorMessage]);
}
