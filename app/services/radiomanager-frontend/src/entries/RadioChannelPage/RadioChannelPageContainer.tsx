import React from "react"
import { ErrorBoundary } from "~/components/ErrorBoundary"
import { ChannelNotFoundError } from "~/modules/RadioManager"
import ChannelNotFound from "./ChannelNotFound"
import { RadioChannelPage } from "./RadioChannelPage"

export const RadioChannelPageContainer: React.FC = () => {
  return (
    <ErrorBoundary cases={[{ when: ChannelNotFoundError, then: ChannelNotFound }]}>
      <RadioChannelPage />
    </ErrorBoundary>
  )
}
