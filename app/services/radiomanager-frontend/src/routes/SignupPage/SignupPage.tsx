import * as React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import LoggedInUserProvider from "~/modules/LoggedInUser/LoggedInUserProvider";
import { config } from "~/config";
import SignupForm from "./components/SignupForm";
import useHandleSubmit from "./use/useHandleSubmit";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useHandleSubmit(email, setEmail, password, setPassword, setErrorMessage);

  return (
    <LoggedInUserProvider
      fallback={
        <SignupForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSignupClicked={handleSubmit}
          errorMessage={errorMessage}
        />
      }
    >
      <Redirect to={config.routes.home} />
    </LoggedInUserProvider>
  );
};

export default SignupPage;
