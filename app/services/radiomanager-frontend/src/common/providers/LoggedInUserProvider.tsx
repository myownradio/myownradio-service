import * as React from "react";
import { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import { useDependencies } from "../appDependencies";
import { ISuccessfulMeResponse } from "../../api/AuthApiClient";
import { withCancelToken } from "../../api/utils";

type IUserState = ISuccessfulMeResponse;

interface LoggedInUserProviderProps {
  fallback?: React.ReactElement;
  children?: React.ReactElement;
}

export const loggedInUserContext = React.createContext<IUserState | null>(null);

const LoggedInUserProvider: React.FC<LoggedInUserProviderProps> = ({ fallback, children }) => {
  const [userState, setUserState] = useState<IUserState | null | false>(null);
  const { authApiClient } = useDependencies();

  useEffect(() => {
    return withCancelToken(() =>
      authApiClient.me().then(setUserState, () => {
        setUserState(false);
      }),
    );
  }, [authApiClient]);

  if (userState) {
    return (
      <loggedInUserContext.Provider value={userState}>{children}</loggedInUserContext.Provider>
    );
  }

  return <>{fallback}</>;
};

LoggedInUserProvider.propTypes = {
  fallback: PropTypes.element,
  children: PropTypes.element,
};

export default LoggedInUserProvider;
