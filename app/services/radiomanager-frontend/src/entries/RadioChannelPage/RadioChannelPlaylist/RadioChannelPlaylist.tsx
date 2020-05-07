import React, { Suspense } from "react"
import { useResource } from "~/utils/suspense"
import { ChannelStore } from "../use/useChannelStore"

interface Props {
  channelStore: ChannelStore
}

const RadioChannelPlaylist: React.FC<Props> = ({ channelStore }) => {
  const tracks = useResource(channelStore.tracksResource)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>{JSON.stringify(tracks)}</div>
    </Suspense>
  )
}

export default RadioChannelPlaylist
