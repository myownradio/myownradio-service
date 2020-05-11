import React from "react"
import RouterLink from "~/components/RouterLink"
import { config } from "~/config"
import { useRadioManagerModel } from "~/modules/RadioManager"
import { createUrlFromRoute } from "~/utils/router"
import { useResource } from "~/utils/suspense2"

export const ChannelsListSidebar: React.FC = () => {
  const radioManagerModel = useRadioManagerModel()
  const radioChannels = useResource(radioManagerModel.radioChannels)

  return (
    <ul>
      {radioChannels.map(radioChannel => (
        <li key={radioChannel.id}>
          <RouterLink href={createUrlFromRoute(config.routes.channel, { channelId: radioChannel.id })}>
            {radioChannel.title}
          </RouterLink>
        </li>
      ))}
    </ul>
  )
}
