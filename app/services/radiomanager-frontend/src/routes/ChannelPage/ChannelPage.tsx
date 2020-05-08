import * as React from "react"
import { useParams, Redirect } from "react-router-dom"
// import { useDependencies } from "~/bootstrap/dependencies"
import CatchError from "~/components/CatchError"
import { config } from "~/config"
import { useServices } from "~/services"
import { wrapPromise } from "~/utils/suspense"
import ChannelView from "./components/ChannelView"

const ChannelPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>()
  const { radioManagerApiService } = useServices()

  const channelResource = wrapPromise(radioManagerApiService.getChannel(channelId))
  const audioTracksResource = wrapPromise(radioManagerApiService.getAudioTracks(channelId))

  return (
    <CatchError fallback={<Redirect to={config.routes.profile} />}>
      <React.Suspense fallback={null}>
        <ChannelView channelResource={channelResource} audioTracksResource={audioTracksResource} />
      </React.Suspense>
    </CatchError>
  )
}

export default ChannelPage
