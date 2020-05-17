import React from "react"
import { Redirect } from "react-router-dom"
import { config } from "~/config"
import { useRadioManagerModel } from "~/modules/RadioManager"
import { createUrlFromRoute } from "~/utils/router"
import { useResource } from "~/utils/suspense2"

const MyChannelsPage: React.FC = () => {
  const radioManagerModel = useRadioManagerModel()
  const radioChannels = useResource(radioManagerModel.radioChannels)

  const redirectTo =
    radioChannels.length > 0
      ? createUrlFromRoute(config.routes.channel, { channelId: radioChannels[0].id })
      : config.routes.createChannel

  return <Redirect to={redirectTo} />
}

export default MyChannelsPage
