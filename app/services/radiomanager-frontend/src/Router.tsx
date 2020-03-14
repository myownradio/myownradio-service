import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import config from "./config";

const LoginPage = React.lazy(() => import("./pages/login/LoginPage/LoginPage"));

const Router: React.FC = () => {
  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Switch>
          <Route path={config.routes.login} component={LoginPage} />
          <Route path={"/test"}>URL: {config.siteUrl}</Route>
          <Route exact path={config.routes.home}>
            <Redirect to={config.routes.login} />
          </Route>
          <Route>404</Route>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
