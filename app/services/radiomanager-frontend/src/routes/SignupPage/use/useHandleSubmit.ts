import { useDependencies } from "~/bootstrap/dependencies";
import { useCallback } from "react";
import { ISetter } from "~/interfaces";
import BadRequestError from "~/services/errors/BadRequestError";

export default function useHandleSubmit(
  email: string,
  setEmail: ISetter<string>,
  password: string,
  setPassword: ISetter<string>,
  setErrorMessage: ISetter<string | null>,
): () => Promise<void> {
  const { authApiService } = useDependencies();

  return useCallback(async () => {
    setErrorMessage(null);

    try {
      await authApiService.signup(email, password);
      alert("Success!");
      // todo Where to redirect?
    } catch (e) {
      if (e instanceof BadRequestError) {
        setErrorMessage("Email and password should be specified");
      } else {
        setErrorMessage("Unknown error occurred");
      }
    }
  }, [email, password, authApiService, setErrorMessage]);
}
