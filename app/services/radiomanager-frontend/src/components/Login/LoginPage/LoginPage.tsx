import * as React from "react";
import { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { useDependencies } from "../../../common/appDependencies";
import UnauthorizedError from "../../../services/errors/UnauthorizedError";
import BadRequestError from "../../../services/errors/BadRequestError";
import config from "../../../config";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const { authApiClient, storageService } = useDependencies();
  const history = useHistory();

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);

    try {
      const { access_token, refresh_token } = await authApiClient.login(email, password);
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
  }, [email, password, history, authApiClient, storageService]);

  return (
    <LoginForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onLoginClicked={handleSubmit}
      errorMessage={errorMessage}
    />
  );
};

LoginPage.propTypes = {};

export default LoginPage;
