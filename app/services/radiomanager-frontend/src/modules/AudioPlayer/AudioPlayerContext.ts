import { createContext } from "react";
import { AudioPlayerStore } from "./AudioPlayerStore";

const AudioPlayerContext = createContext<AudioPlayerStore | null>(null);

export default AudioPlayerContext;
