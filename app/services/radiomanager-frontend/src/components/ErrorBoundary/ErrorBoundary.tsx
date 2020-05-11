import React from "react"

interface Newable<T> {
  new (...args: never[]): T
}

interface Case<T> {
  when: Newable<T>
  then: React.ComponentType<{ error: T }>
}

interface Props {
  cases: Array<Case<Error>>
}

type State =
  | {
      failure: true
      error: Error
    }
  | {
      failure: false
      error: null
    }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    failure: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { failure: true, error }
  }

  public render(): React.ReactNode {
    if (!this.state.failure) {
      return <>{this.props.children}</>
    }

    const caseIndex = this.props.cases.findIndex(({ when }) => this.state.error instanceof when)

    if (caseIndex === -1) {
      throw this.state.error
    }

    const Component = this.props.cases[caseIndex].then

    return <Component error={this.state.error} />
  }
}
