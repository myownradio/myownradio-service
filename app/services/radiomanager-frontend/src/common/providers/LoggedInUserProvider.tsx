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

type IUserResolvingState = "init" | "failed" | "resolved";

export const loggedInUserContext = React.createContext<IUserState | null>(null);

const LoggedInUserProvider: React.FC<LoggedInUserProviderProps> = ({
  fallback,
  children,
  loader,
}) => {
  const [userResolvingState, setUserResolvingState] = useState<IUserResolvingState>("init");
  const [userState, setUserState] = useState<IUserState | null>(null);
  const { authApiClient } = useDependencies();

  useEffect(() => {
    return withCancelToken(() =>
      authApiClient.me().then(
        userState => {
          setUserResolvingState("resolved");
          setUserState(userState);
        },
        () => {
          setUserResolvingState("failed");
          setUserState(null);
        },
      ),
    );
  }, [authApiClient]);

  if (userResolvingState === "resolved" && userState !== null) {
    return (
      <loggedInUserContext.Provider value={userState}>{children}</loggedInUserContext.Provider>
    );
  }

  if (userResolvingState === "failed") {
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
