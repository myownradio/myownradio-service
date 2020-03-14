import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const LoginPage = React.lazy(() => import("./pages/login/LoginPage"));

const Router = () => {
  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/">Home Page</Route>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
