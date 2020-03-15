import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import config from "./config";
import AudioPlayer from "./common/player/AudioPlayer";

const LoginPage = React.lazy(() => import("./pages/login/LoginPage/LoginPage"));

const Router: React.FC = () => {
  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Switch>
          <Route exact path={config.routes.login} component={LoginPage} />
          <Route path={[config.routes.home, config.routes.test]}>
            <AudioPlayer>
              <Route exact path={config.routes.home}>
                Home Route
              </Route>
              <Route exact path={config.routes.test}>
                Test Route
              </Route>
            </AudioPlayer>
          </Route>
          <Route>404 Not Found</Route>
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
};

export default Router;
