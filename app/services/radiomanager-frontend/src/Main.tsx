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
const CreateChannelPage = React.lazy(() => import("./routes/CreateChannelPage"));
const ChannelPage = React.lazy(() => import("./routes/ChannelPage"));

const Main: React.FC = () => {
  return (
    <Localization.Provider>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Switch>
            <Route exact path={routes.login} component={LoginPage} />
            <Route exact path={routes.signup} component={SignupPage} />
            <Route exact path={routes.logout} component={LogoutPage} />
            <Route exact path={[routes.home, routes.profile, routes.createChannel, routes.channel]}>
              <LoggedInUser.Provider fallback={<Redirect to={routes.login} />}>
                <AudioPlayer.Provider>
                  <Switch>
                    <Redirect exact from={routes.home} to={routes.profile} />
                    <Route exact path={routes.profile} component={ProfilePage} />
                    <Route exact path={routes.createChannel} component={CreateChannelPage} />
                    <Route exact path={routes.channel} component={ChannelPage} />
                  </Switch>
                  <Link to={routes.logout}>Logout</Link>
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
