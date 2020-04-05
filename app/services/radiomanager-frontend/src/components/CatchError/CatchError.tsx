import * as PropTypes from "prop-types";
import * as React from "react";

interface CatchErrorProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface CatchErrorState {
  failure: boolean;
  error: null | Error;
}

export default class CatchError extends React.Component<CatchErrorProps, CatchErrorState> {
  state = {
    failure: false,
    error: null,
  };

  static propTypes = {
    children: PropTypes.element.isRequired,
    fallback: PropTypes.element.isRequired,
  };

  static getDerivedStateFromError(error: Error): CatchErrorState {
    return { failure: true, error };
  }

  public render(): React.ReactElement {
    return <>{this.state.failure ? this.props.fallback : this.props.children}</>;
  }
}
