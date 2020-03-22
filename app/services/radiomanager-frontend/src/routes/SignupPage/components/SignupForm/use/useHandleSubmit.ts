import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDependencies } from "~/bootstrap/dependencies";
import { IErrorMessage } from "~/components/use/useErrorMessage";
import { config } from "~/config";
import { ISetter } from "~/interfaces";
import AbstractErrorWithReason from "~/services/errors/AbstractErrorWithReason";

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

    try {
      await authApiService.signup(email, password);
      history.push(config.routes.login);
    } catch (e) {
      if (e instanceof AbstractErrorWithReason) {
        setErrorMessage(e.localeKey);
      } else {
        setErrorMessage("api_error");
      }
    }
  }, [email, password, authApiService, setErrorMessage, history]);
}
