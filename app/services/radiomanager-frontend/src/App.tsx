import React, { Suspense } from "react"
import Router from "./Router"
import { Provider as LocalizationProvider } from "./modules/Localization"

const App: React.FC = () => (
  <LocalizationProvider>
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  </LocalizationProvider>
)

export default App
