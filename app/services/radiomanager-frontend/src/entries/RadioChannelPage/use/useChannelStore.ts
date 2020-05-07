// import { useServices } from "~/services"
// import { RadioManagerAudioTrack } from "~/services/api/RadioManagerService"
import { useEffect, useRef, useState, useTransition } from "react"
import { notImplementedAsync } from "~/utils/fn"
import { MutableResource, wrapPromise } from "~/utils/suspense"

export interface ChannelStore {
  tracksResource: MutableResource<string[]>

  uploadTrack(audioFile?: File): Promise<void>
  deleteTrack(trackId?: string): Promise<void>
  moveTrack(trackId: string, newOrderId: number): Promise<void>

  startChannel(): Promise<void>
  stopChannel(): Promise<void>
  pauseChannel(): Promise<void>
}

export default function useChannelStore(channelId: string): ChannelStore {
  // const { radioManagerService } = useServices()
  // const tracksResource = wrapPromise(radioManagerService.getAudioTracks(channelId))
  // const [startTransition, isPending] = useTransition({
  //   timeoutMs: 3000,
  // })
  const [tracksResource, setTracksResource] = useState<MutableResource<string[]>>()

  useEffect(() => {
    setTracksResource(
      wrapPromise(
        new Promise<string[]>(resolve => {
          console.log("page read")
          setTimeout(() => resolve(["item1", "item2"]), 3000)
        }),
      ),
    )
  }, [channelId])

  return {
    tracksResource,

    uploadTrack: async (): Promise<void> => tracksResource.mutate(items => [...items, `item${items.length + 1}`]),
    deleteTrack: async (): Promise<void> => tracksResource.mutate(() => []),
    moveTrack: notImplementedAsync,

    startChannel: notImplementedAsync,
    stopChannel: notImplementedAsync,
    pauseChannel: notImplementedAsync,
  }
}
