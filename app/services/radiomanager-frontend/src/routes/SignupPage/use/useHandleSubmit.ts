import { useDependencies } from "~/bootstrap/dependencies";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ISetter } from "~/interfaces";
import BadRequestError from "~/services/errors/BadRequestError";
import EmailExistsError from "~/services/errors/EmailExistsError";
import { config } from "~/config";

export default function useHandleSubmit(
  email: string,
  setEmail: ISetter<string>,
  password: string,
  setPassword: ISetter<string>,
  setErrorMessage: ISetter<string | null>,
): () => Promise<void> {
  const { authApiService } = useDependencies();
  const history = useHistory();

  return useCallback(async () => {
    setErrorMessage(null);

    try {
      await authApiService.signup(email, password);
      history.push(config.routes.login);
    } catch (e) {
      if (e instanceof BadRequestError) {
        setErrorMessage("Email and password should be specified");
      } else if (e instanceof EmailExistsError) {
        setErrorMessage("Email used by someone else");
      } else {
        setErrorMessage("Unknown error occurred");
      }
    }
  }, [email, password, authApiService, setErrorMessage, history]);
}
