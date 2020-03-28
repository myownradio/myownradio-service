import { Suspense } from "react";
import * as React from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

import { config } from "~/config";
import AudioPlayer from "~/modules/AudioPlayer";
import Localization from "~/modules/Localization";
import LoggedInUser from "~/modules/LoggedInUser";

const { routes } = config;
const Loader: React.FC = () => <>Loading...</>;

const LoginPage = React.lazy(() => import("./routes/LoginPage"));
const SignupPage = React.lazy(() => import("./routes/SignupPage"));
const LogoutPage = React.lazy(() => import("./routes/LogoutPage"));
const ProfilePage = React.lazy(() => import("./routes/ProfilePage"));

const Main: React.FC = () => {
  return (
    <Localization.Provider>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Switch>
            <Route exact path={routes.login} component={LoginPage} />
            <Route exact path={routes.signup} component={SignupPage} />
            <Route exact path={routes.logout} component={LogoutPage} />
            <Route exact path={[routes.home, routes.test]}>
              <LoggedInUser.Provider fallback={<Redirect to={routes.login} />}>
                <AudioPlayer.Provider>
                  <Route exact path={routes.home}>
                    <ProfilePage />
                    <Link to={routes.logout}>Logout</Link>
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
