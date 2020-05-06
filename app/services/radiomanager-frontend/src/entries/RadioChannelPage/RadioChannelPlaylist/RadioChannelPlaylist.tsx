import React from "react"
import useResource from "~/components/use/useResource"
import { ChannelStore } from "../use/useChannelStore"

interface Props {
  channelStore: ChannelStore
}

const RadioChannelPlaylist: React.FC<Props> = ({ channelStore }) => {
  const tracks = useResource(channelStore.tracksResource)

  return <div>{JSON.stringify(tracks)}</div>
}

export default RadioChannelPlaylist
