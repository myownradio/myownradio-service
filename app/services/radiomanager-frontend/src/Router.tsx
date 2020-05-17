import React from "react"
import { BrowserRouter, /* Link, Redirect, */ Route, Switch } from "react-router-dom"
import { config } from "~/config"
import { AuthenticatedUserProvider } from "~/modules/Authentication"

const NotFoundPage = React.lazy(() => import("./entries/NotFoundPage"))
const LoginPage = React.lazy(() => import("./entries/LoginPage"))
const SignupPage = React.lazy(() => import("./entries/SignupPage"))
const RadioChannelPage = React.lazy(() => import("./entries/RadioChannelPage"))
const MyChannelsPage = React.lazy(() => import("./entries/MyChannelsPage"))

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={config.routes.login} component={LoginPage} />
      <Route exact path={config.routes.signup} component={SignupPage} />
      <Route exact path={[config.routes.channel, config.routes.myChannels]}>
        <AuthenticatedUserProvider>
          <Switch>
            <Route exact path={config.routes.channel} component={RadioChannelPage} />
            <Route exact path={config.routes.myChannels} component={MyChannelsPage} />
          </Switch>
        </AuthenticatedUserProvider>
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
)

export default Router
