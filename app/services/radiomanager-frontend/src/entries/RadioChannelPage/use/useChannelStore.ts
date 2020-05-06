import { useServices } from "~/services"
import { RadioManagerAudioTrack } from "~/services/api/RadioManagerService"
import { notImplementedAsync } from "~/utils/fn"
import { Resource, wrapPromise } from "~/utils/suspense"

export interface ChannelStore {
  tracksResource: Resource<RadioManagerAudioTrack[]>

  uploadTrack(audioFile: File): Promise<void>
  deleteTrack(trackId: string): Promise<void>
  moveTrack(trackId: string, newOrderId: number): Promise<void>

  startChannel(): Promise<void>
  stopChannel(): Promise<void>
  pauseChannel(): Promise<void>
}

export default function useChannelStore(channelId: string): ChannelStore {
  const { radioManagerService } = useServices()
  const tracksResource = wrapPromise(radioManagerService.getAudioTracks(channelId))

  return {
    tracksResource,

    uploadTrack: notImplementedAsync,
    deleteTrack: notImplementedAsync,
    moveTrack: notImplementedAsync,

    startChannel: notImplementedAsync,
    stopChannel: notImplementedAsync,
    pauseChannel: notImplementedAsync,
  }
}
