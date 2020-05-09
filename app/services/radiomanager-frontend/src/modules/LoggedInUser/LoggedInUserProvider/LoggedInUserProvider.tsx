import * as PropTypes from "prop-types"
import * as React from "react"
import { useEffect } from "react"

import { useServices } from "~/services"
import { SuccessfulMeResponse } from "~/services/api/AuthApiService"

import useAuthState from "./use/useAuthState"

type IUserState = SuccessfulMeResponse

interface LoggedInUserProviderProps {
  fallback?: React.ReactNode
  loader?: React.ReactNode
  children?: React.ReactNode
}

export const loggedInUserContext = React.createContext<IUserState | null>(null)

const LoggedInUserProvider: React.FC<LoggedInUserProviderProps> = ({ fallback, children, loader }) => {
  const [authState, setAuthState] = useAuthState()
  const { authApiService } = useServices()

  useEffect(() => {
    authApiService.me().then(
      userState => {
        setAuthState({ authenticated: true, userState })
      },
      () => {
        setAuthState({ authenticated: false })
      },
    )
  }, [authApiService, setAuthState])

  if (authState.authenticated === true) {
    return <loggedInUserContext.Provider value={authState.userState}>{children}</loggedInUserContext.Provider>
  }

  if (authState.authenticated === false) {
    return <>{fallback}</>
  }

  return <>{loader || null}</>
}

LoggedInUserProvider.propTypes = {
  fallback: PropTypes.node,
  children: PropTypes.node,
  loader: PropTypes.node,
}

export default LoggedInUserProvider
