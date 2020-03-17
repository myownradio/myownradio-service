import { useDependencies } from "~/bootstrap/dependencies";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { config } from "~/config";
import { ISetter } from "~/interfaces";
import UnauthorizedError from "~/services/errors/UnauthorizedError";
import BadRequestError from "~/services/errors/BadRequestError";

export default function useHandleSubmit(
  email: string,
  setEmail: ISetter<string>,
  password: string,
  setPassword: ISetter<string>,
  setErrorMessage: ISetter<string | null>,
): () => Promise<void> {
  const { authApiService, storageService } = useDependencies();
  const history = useHistory();

  return useCallback(async () => {
    setErrorMessage(null);

    try {
      const { access_token, refresh_token } = await authApiService.login(email, password);
      storageService.put("access_token", access_token);
      storageService.put("refresh_token", refresh_token);
      history.push(config.routes.home);
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        setErrorMessage("Wrong email or password provided");
      } else if (e instanceof BadRequestError) {
        setErrorMessage("Email and password should be specified");
      } else {
        setErrorMessage("Unknown error occurred");
      }
    }
  }, [email, password, history, authApiService, storageService, setErrorMessage]);
}
