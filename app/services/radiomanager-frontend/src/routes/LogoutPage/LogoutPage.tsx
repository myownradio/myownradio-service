import * as React from "react"
import { useEffect } from "react"
import { useHistory } from "react-router-dom"

import { config } from "~/config"
import { useServices } from "~/services"

const LogoutPage: React.FC = () => {
  const history = useHistory()
  const { sessionService } = useServices()

  useEffect(() => {
    sessionService.clearTokens()
    history.push(config.routes.login)
  }, [history, sessionService])
  return null
}

export default LogoutPage
