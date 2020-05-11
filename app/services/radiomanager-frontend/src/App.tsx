import React, { Suspense } from "react"
import Router from "./Router"
import { ErrorBoundary } from "./components/ErrorBoundary"

const SomethingWentWrong = (): React.ReactElement => <h1>Something went wrong...</h1>

const App: React.FC = () => (
  <ErrorBoundary cases={[{ when: Error, then: SomethingWentWrong }]}>
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  </ErrorBoundary>
)

export default App
