import React from "react"
import { BrowserRouter, /* Link, Redirect, */ Route, Switch } from "react-router-dom"
import { ErrorBoundary } from "~/components/ErrorBoundary"
import { config } from "~/config"
import LoginPage from "~/entries/LoginPage"
import { AuthenticatedUserProvider } from "~/modules/Authentication"
import { ChannelNotFoundError } from "~/modules/RadioManager"
// import { Provider as AudioPlayerProvider } from "../modules/AudioPlayer"
// import { Provider as LoggedInUserProvider } from "../modules/LoggedInUser"

// const SignupPage = React.lazy(() => import("./routes/SignupPage"))
// const LogoutPage = React.lazy(() => import("../routes/LogoutPage"))
// const ProfilePage = React.lazy(() => import("../routes/ProfilePage"))
// const CreateChannelPage = React.lazy(() => import("../routes/CreateChannelPage"))
// const ChannelPage = React.lazy(() => import("../routes/ChannelPage"))

const RadioChannelPage = React.lazy(() => import("./entries/RadioChannelPage"))

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={"/test/:channelId"} component={RadioChannelPage} />
      <Route exact path={config.routes.login} component={LoginPage} />

      <Route exact path={[config.routes.channel]}>
        <AuthenticatedUserProvider>
          <Switch>
            <Route exact path={config.routes.channel}>
              <ErrorBoundary cases={[{ when: ChannelNotFoundError, then: <>Channel not found</> }]}>
                <RadioChannelPage />
              </ErrorBoundary>
            </Route>
          </Switch>
        </AuthenticatedUserProvider>
      </Route>
      {/*<Route exact path={config.routes.signup} component={SignupPage} />*/}
      {/*<Route exact path={config.routes.logout} component={LogoutPage} />*/}
      {/*<Route*/}
      {/*  exact*/}
      {/*  path={[config.routes.home, config.routes.profile, config.routes.createChannel, config.routes.channel]}*/}
      {/*>*/}
      {/*  <LoggedInUserProvider fallback={<Redirect to={config.routes.login} />}>*/}
      {/*    <AudioPlayerProvider>*/}
      {/*      <Switch>*/}
      {/*        <Redirect exact from={config.routes.home} to={config.routes.profile} />*/}
      {/*        <Route exact path={config.routes.profile} component={ProfilePage} />*/}
      {/*        <Route exact path={config.routes.createChannel} component={CreateChannelPage} />*/}
      {/*        <Route exact path={config.routes.channel} component={ChannelPage} />*/}
      {/*      </Switch>*/}
      {/*      <Link to={config.routes.logout}>Logout</Link>*/}
      {/*    </AudioPlayerProvider>*/}
      {/*  </LoggedInUserProvider>*/}
      {/*</Route>*/}
      <Route>404 Not Found</Route>
    </Switch>
  </BrowserRouter>
)

export default Router
