import * as React from "react";
import * as PropTypes from "prop-types";
import { useDependencies } from "../reactAppDependencies";

export interface LoggedInUserProviderProps {
  fallback?: React.ReactElement;
  children?: React.ReactElement;
}

const LoggedInUserProvider: React.FC<LoggedInUserProviderProps> = ({ fallback, children }) => {
  const { storageService } = useDependencies();

  if (storageService.get("access_key")) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

LoggedInUserProvider.propTypes = {
  fallback: PropTypes.element,
  children: PropTypes.element,
};

export default LoggedInUserProvider;
