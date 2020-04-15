import { useContext } from "react";
import Context from "../AudioPlayerContext";
import { AudioPlayerStore } from "../AudioPlayerStore";

export default function useAudioPlayerStore(): AudioPlayerStore {
  const audioPlayerStore = useContext(Context);
  if (!audioPlayerStore) {
    throw new Error("You probably forgot to put <AudioPlayerProvider>.");
  }
  return audioPlayerStore;
}
