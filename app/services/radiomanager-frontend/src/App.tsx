import React, { Suspense } from "react"
import Router from "./Router"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Provider as LocalizationProvider } from "./modules/Localization"

const App: React.FC = () => (
  <ErrorBoundary cases={[{ when: Error, then: <h1>Something went wrong...</h1> }]}>
    <LocalizationProvider>
      <Suspense fallback={null}>
        <Router />
      </Suspense>
    </LocalizationProvider>
  </ErrorBoundary>
)

export default App
