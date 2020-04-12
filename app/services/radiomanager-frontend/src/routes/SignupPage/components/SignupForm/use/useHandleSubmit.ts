import { validate as isValidEmail } from "email-validator";
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
  const { authApiService } = useDependencies();
  const history = useHistory();

  return useCallback(async () => {
    setErrorMessage(null);

    if (!isValidEmail(email)) {
      setErrorMessage("ui_signup_validator_email_invalid_message");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("ui_signup_validator_password_short_message");
      return;
    }

    try {
      await authApiService.signup(email, password);
      history.push(config.routes.login);
    } catch (e) {
      if (e instanceof AbstractErrorWithLocaleKey) {
        setErrorMessage(e.localeKey);
      } else {
        setErrorMessage("api_error");
      }
    }
  }, [email, password, authApiService, setErrorMessage, history]);
}
