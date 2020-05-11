import React from "react"
import { useParams } from "react-router-dom"
import useFileSelect from "~/components/use/useFileSelect"
import { useAuthenticatedUser } from "~/modules/Authentication"
import { useRadioChannelModel } from "~/modules/RadioManager"
import { nop } from "~/utils/fn"
import { useResource } from "~/utils/suspense2"

interface RouteParams {
  channelId: string
}

export const RadioChannelPage: React.FC = () => {
  const { channelId } = useParams<RouteParams>()
  const { email } = useAuthenticatedUser()
  const radioChannelModel = useRadioChannelModel(channelId)
  const audioTracks = useResource(radioChannelModel.audioTracks)
  const selectFile = useFileSelect("audio/mp3", files => {
    files.forEach(file => radioChannelModel.uploadAudioFile(file).catch(nop))
  })

  return (
    <>
      <div>You</div>
      <div>{email}</div>
      <div>Channel</div>
      <div>{channelId}</div>
      <div>Tracks Count</div>
      <div>{audioTracks.length}</div>
      <div>Tracks</div>
      <div>
        <ul>
          {audioTracks.map(({ name, id }) => (
            <li key={id}>{name}</li>
          ))}
        </ul>
      </div>
      <button onClick={selectFile}>Upload</button>
    </>
  )
}
