import React, { Suspense } from "react"
import { Provider as LocalizationProvider } from "../modules/Localization"
import Router from "./Router"

const App: React.FC = () => (
  <LocalizationProvider>
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  </LocalizationProvider>
)

export default App
