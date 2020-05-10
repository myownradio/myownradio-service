import React from "react"
import { useParams } from "react-router-dom"
import { useAuthenticatedUser } from "~/modules/Authentication"
import { useRadioChannelModel } from "~/modules/RadioManager"
import { useResource } from "~/utils/suspense2"

interface RouteParams {
  channelId: string
}

const RadioChannelPage: React.FC = () => {
  const { channelId } = useParams<RouteParams>()
  const { email } = useAuthenticatedUser()
  const radioChannelModel = useRadioChannelModel(channelId)
  const audioTracks = useResource(radioChannelModel.audioTracks)

  return (
    <>
      <div>You</div>
      <div>{email}</div>
      <div>Channel</div>
      <div>{channelId}</div>
      <div>Tracks Count</div>
      <div>{audioTracks.length}</div>
    </>
  )
}

export default RadioChannelPage
