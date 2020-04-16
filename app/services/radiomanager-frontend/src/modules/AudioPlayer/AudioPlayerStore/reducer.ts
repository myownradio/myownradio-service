import { Event } from "./player";
import { AudioPlayerState } from "./state";

export function reducer(state: AudioPlayerState, event: Event): AudioPlayerState {
  switch (event.type) {
    case "INITIALIZED":
      return { ...state, status: "stopped" };
    case "AUDIO_UNSUPPORTED":
      return { ...state, status: "audio_unsupported" };
    case "MEDIA_ERROR":
      return { ...state, status: "media_error" };
    case "LOADING":
      return { ...state, status: "loading" };
    case "PLAYING":
      return { ...state, status: "playing" };
    case "STOPPED":
      return { ...state, status: "stopped" };
    case "ON_PROGRESS":
      return { ...state, currentTime: event.currentTime };
    default:
      return state;
  }
}
