import React from "react"
import { BrowserRouter, /* Link, Redirect, */ Route, Switch } from "react-router-dom"
import { config } from "~/config"
import { AuthenticatedUserProvider } from "~/modules/Authentication"
// import { Provider as AudioPlayerProvider } from "../modules/AudioPlayer"
// import { Provider as LoggedInUserProvider } from "../modules/LoggedInUser"

// const SignupPage = React.lazy(() => import("./routes/SignupPage"))
// const LogoutPage = React.lazy(() => import("../routes/LogoutPage"))
// const ProfilePage = React.lazy(() => import("../routes/ProfilePage"))
// const CreateChannelPage = React.lazy(() => import("../routes/CreateChannelPage"))
// const ChannelPage = React.lazy(() => import("../routes/ChannelPage"))

const LoginPage = React.lazy(() => import("./entries/LoginPage"))
const SignupPage = React.lazy(() => import("./entries/SignupPage"))
const RadioChannelPage = React.lazy(() => import("./entries/RadioChannelPage"))

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={config.routes.login} component={LoginPage} />
      <Route exact path={config.routes.signup} component={SignupPage} />

      <Route exact path={[config.routes.channel]}>
        <AuthenticatedUserProvider>
          <Switch>
            <Route exact path={config.routes.channel}>
              <RadioChannelPage />
            </Route>
          </Switch>
        </AuthenticatedUserProvider>
      </Route>
      <Route>404 Not Found</Route>
    </Switch>
  </BrowserRouter>
)

export default Router
