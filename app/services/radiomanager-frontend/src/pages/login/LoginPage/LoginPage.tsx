import * as React from "react";
import { useState, useCallback } from "react";
import LoginForm from "../LoginForm/LoginForm";
import { useDependencies } from "../../../common/reactAppDependencies";
import UnauthorizedError from "../../../api/errors/UnauthorizedError";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const { authServer } = useDependencies();

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);
    try {
      const { access_token, refresh_token } = await authServer.login(email, password);
    } catch (e) {
      console.log(e.constructor.name);
      if (e instanceof UnauthorizedError) {
        setErrorMessage("Wrong email or password provided");
      } else {
        setErrorMessage("Unknown error occurred");
      }
    }
  }, [email, password]);

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
