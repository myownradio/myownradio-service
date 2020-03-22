import * as React from "react";
import { Suspense } from "react";
import { IntlProvider } from "react-intl";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { config } from "~/config";
import messagesEn from "~/locales/english";
import AudioPlayerProvider from "~/modules/AudioPlayer/AudioPlayerProvider";
import LoggedInUserProvider from "~/modules/LoggedInUser/LoggedInUserProvider";

const { routes } = config;
const Loader: React.FC = () => <>Loading...</>;

const LoginPage = React.lazy(() => import("./routes/LoginPage"));
const SignupPage = React.lazy(() => import("./routes/SignupPage"));

const Main: React.FC = () => {
  return (
    <IntlProvider locale="en" messages={messagesEn}>
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <Switch>
            <Route exact path={routes.login} component={LoginPage} />
            <Route exact path={routes.signup} component={SignupPage} />
            <Route exact path={[routes.home, routes.test]}>
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
    </IntlProvider>
  );
};

export default Main;
