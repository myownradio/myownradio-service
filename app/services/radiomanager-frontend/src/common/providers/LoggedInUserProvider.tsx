import * as React from "react";
import * as PropTypes from "prop-types";

export interface LoggedInUserProviderProps {
  fallback?: React.ReactElement;
  children?: React.ReactElement;
}

const LoggedInUserProvider: React.FC<LoggedInUserProviderProps> = ({ children }) => <>{children}</>;

LoggedInUserProvider.propTypes = {
  fallback: PropTypes.element,
  children: PropTypes.element,
};

export default LoggedInUserProvider;
