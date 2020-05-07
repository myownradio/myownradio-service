import React from "react"
import { useParams } from "react-router-dom"
import RadioChannelPlaylist from "./RadioChannelPlaylist"
import useChannelStore from "./use/useChannelStore"

interface RouteParams {
  channelId: string
}

const RadioChannelPage: React.FC = () => {
  const { channelId } = useParams<RouteParams>()
  const channelStore = useChannelStore(channelId)

  return (
    <>
      <h1>Items</h1>
      {/*<RadioChannelPlaylist channelStore={channelStore} />*/}
      {/*<button onClick={() => channelStore.uploadTrack()}>Add</button>*/}
      {/*<button onClick={() => channelStore.deleteTrack()}>Clear</button>*/}
    </>
  )
}

export default RadioChannelPage
