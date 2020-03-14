import * as React from "react";
import { useState, useCallback } from "react";
import LoginForm from "./LoginForm/LoginForm";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = useCallback(() => {
    console.log({ email, password });
  }, [email, password]);

  return (
    <LoginForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onLoginClicked={handleSubmit}
    />
  );
};

LoginPage.propTypes = {};

export default LoginPage;
