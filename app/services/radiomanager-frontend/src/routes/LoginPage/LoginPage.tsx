import * as React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { config } from "~/config";
import LoggedInUserProvider from "~/modules/LoggedInUser/LoggedInUserProvider";
import useHandleSubmit from "~/routes/LoginPage/use/useHandleSubmit";
import LoginForm from "./components/LoginForm";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleSubmit = useHandleSubmit(email, setEmail, password, setPassword, setErrorMessage);

  return (
    <LoggedInUserProvider
      fallback={
        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onLoginClicked={handleSubmit}
          errorMessage={errorMessage}
        />
      }
    >
      <Redirect to={config.routes.home} />
    </LoggedInUserProvider>
  );
};

LoginPage.propTypes = {};

export default LoginPage;
