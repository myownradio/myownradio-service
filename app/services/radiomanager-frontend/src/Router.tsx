import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import config from "./config";
import AudioPlayerProvider from "./common/player/AudioPlayerProvider";
import LoggedInUserProvider from "./common/providers/LoggedInUserProvider";

const { routes } = config;

const Loader: React.FC = () => <>Loading...</>;

const LoginPage = React.lazy(() => import("./pages/login/LoginPage"));

const Router: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.login} component={LoginPage} />
          <Route path={[routes.home, routes.test]}>
            <LoggedInUserProvider fallback={<Redirect to={routes.login} />}>
              <AudioPlayerProvider>
                <Route exact path={routes.home}>
                  Home Route
                </Route>
                <Route exact path={routes.test}>
                  Test Route
                </Route>
              </AudioPlayerProvider>
            </LoggedInUserProvider>
          </Route>
          <Route>404 Not Found</Route>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
