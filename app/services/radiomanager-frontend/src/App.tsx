import React, { Suspense } from "react"
import Router from "./Router"
import { ErrorBoundary } from "./components/ErrorBoundary"
import SomethingWentWrong from "./entries/ErrorPage"

const App: React.FC = () => (
  <ErrorBoundary cases={[{ when: Error, then: SomethingWentWrong }]}>
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  </ErrorBoundary>
)

export default App
