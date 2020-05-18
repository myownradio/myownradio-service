import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { config } from "~/config"
import { AuthenticatedUserProvider } from "~/modules/Authentication"
import HomePage from "./entries/HomePage"
import LoginPage from "./entries/LoginPage"
import MyChannelsPage from "./entries/MyChannelsPage"
import NotFoundPage from "./entries/NotFoundPage"
import RadioChannelPage from "./entries/RadioChannelPage"
import SignupPage from "./entries/SignupPage"

const Router: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path={config.routes.home} component={HomePage} />
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
