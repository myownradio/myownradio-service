import * as PropTypes from "prop-types"
import * as React from "react"

interface CatchErrorProps {
  children: React.ReactNode
  fallback: (error: Error) => React.ReactNode
}

type CatchErrorState =
  | {
      failure: true
      error: Error
    }
  | {
      failure: false
      error: null
    }

export default class CatchError extends React.Component<CatchErrorProps, CatchErrorState> {
  state: CatchErrorState = {
    failure: false,
    error: null,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    fallback: PropTypes.element.isRequired,
  }

  static getDerivedStateFromError(error: Error): CatchErrorState {
    return { failure: true, error }
  }

  public render(): React.ReactElement {
    return <>{this.state.failure ? this.props.fallback(this.state.error) : this.props.children}</>
  }
}
