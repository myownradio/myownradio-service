import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { config } from "~/config";
import AudioPlayer from "~/modules/AudioPlayer";
import Localization from "~/modules/Localization";
import LoggedInUser from "~/modules/LoggedInUser";

const { routes } = config;
const Loader: React.FC = () => <>Loading...</>;

const LoginPage = React.lazy(() => import("./routes/LoginPage"));
const SignupPage = React.lazy(() => import("./routes/SignupPage"));

const Main: React.FC = () => {
  return (
    <Localization.Provider>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Switch>
            <Route exact path={routes.login} component={LoginPage} />
            <Route exact path={routes.signup} component={SignupPage} />
            <Route exact path={[routes.home, routes.test]}>
              <LoggedInUser.Provider fallback={<Redirect to={routes.login} />}>
                <AudioPlayer.Provider>
                  <Route exact path={routes.home}>
                    Home Route
                  </Route>
                  <Route exact path={routes.test}>
                    Test Route
                  </Route>
                </AudioPlayer.Provider>
              </LoggedInUser.Provider>
            </Route>
            <Route>404 Not Found</Route>
          </Switch>
        </BrowserRouter>
      </Suspense>
    </Localization.Provider>
  );
};

export default Main;
