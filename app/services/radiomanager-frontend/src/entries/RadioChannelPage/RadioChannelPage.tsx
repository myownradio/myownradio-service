import React from "react"
import { useParams } from "react-router-dom"
import { useAuthenticatedUser } from "~/modules/Authentication"

interface RouteParams {
  channelId: string
}

const RadioChannelPage: React.FC = () => {
  const { channelId } = useParams<RouteParams>()
  const { email } = useAuthenticatedUser()

  return (
    <>
      <div>You</div>
      <div>{email}</div>
      <div>Channel</div>
      <div>{channelId}</div>
      {/*<RadioChannelPlaylist channelStore={channelStore} />*/}
      {/*<button onClick={() => channelStore.uploadTrack()}>Add</button>*/}
      {/*<button onClick={() => channelStore.deleteTrack()}>Clear</button>*/}
    </>
  )
}

export default RadioChannelPage
