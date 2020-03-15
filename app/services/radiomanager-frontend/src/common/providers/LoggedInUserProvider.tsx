import * as React from "react";
import { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import { useDependencies } from "../appDependencies";
import { ISuccessfulMeResponse } from "../../api/AuthApiClient";
import { withCancelToken } from "../../api/utils";

type IUserState = ISuccessfulMeResponse;

interface LoggedInUserProviderProps {
  fallback?: React.ReactNode;
  loader?: React.ReactNode;
  children?: React.ReactNode;
}

export const loggedInUserContext = React.createContext<IUserState | null>(null);

const LoggedInUserProvider: React.FC<LoggedInUserProviderProps> = ({
  fallback,
  children,
  loader,
}) => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [userState, setUserState] = useState<IUserState | null>(null);
  const { authApiClient } = useDependencies();

  useEffect(() => {
    return withCancelToken(() =>
      authApiClient.me().then(
        userState => {
          setAuthorized(true);
          setUserState(userState);
        },
        () => {
          setAuthorized(false);
          setUserState(null);
        },
      ),
    );
  }, [authApiClient]);

  if (authorized === true && userState !== null) {
    return (
      <loggedInUserContext.Provider value={userState}>{children}</loggedInUserContext.Provider>
    );
  }

  if (authorized === false) {
    return <>{fallback}</>;
  }

  return <>{loader || null}</>;
};

LoggedInUserProvider.propTypes = {
  fallback: PropTypes.node,
  children: PropTypes.node,
  loader: PropTypes.node,
};

export default LoggedInUserProvider;
