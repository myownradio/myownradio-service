import { useEffect, useState } from "react"
import { AudioPlayerState } from "../AudioPlayerStore"
import useAudioPlayerStore from "./useAudioPlayerStore"

export default function useAudioPlayerState(): AudioPlayerState {
  const store = useAudioPlayerStore()
  const [state, setState] = useState<AudioPlayerState>(store.state$.getValue())

  useEffect(() => {
    const subscription = store.state$.subscribe(setState)
    return (): void => {
      subscription.unsubscribe()
    }
  }, [store])

  return state
}
