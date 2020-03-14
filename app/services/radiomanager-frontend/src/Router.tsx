import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const LoginPage = React.lazy(() => import("./pages/login/LoginPage"));

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/"><>Home Page</></Route>
        <Route path="/login">
          <LoginPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
