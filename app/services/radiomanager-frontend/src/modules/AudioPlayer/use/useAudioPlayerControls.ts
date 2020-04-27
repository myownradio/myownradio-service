import useAudioPlayerStore from "./useAudioPlayerStore"

export interface UseAudioPlayerControls {
  play(url: string): void
  stop(): void
}

export default function useAudioPlayerControls(): UseAudioPlayerControls {
  const store = useAudioPlayerStore()

  return {
    play: store.play,
    stop: store.stop,
  }
}
