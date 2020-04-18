interface AudioUnsupportedEvent {
  type: "AUDIO_UNSUPPORTED";
}
export function createAudioUnsupportedEvent(): AudioUnsupportedEvent {
  return { type: "AUDIO_UNSUPPORTED" };
}

interface AudioInitializationErrorEvent {
  type: "AUDIO_INITIALIZATION_ERROR";
  message: string;
}
export function createAudioInitializationErrorEvent(message: string): AudioInitializationErrorEvent {
  return { type: "AUDIO_INITIALIZATION_ERROR", message };
}

interface MediaErrorEvent {
  type: "MEDIA_ERROR";
  message: string;
  url: string;
}
export function createMediaErrorEvent(message: string, url: string): MediaErrorEvent {
  return { type: "MEDIA_ERROR", message, url };
}

interface LoadingEvent {
  type: "LOADING";
}
export function createLoadingEvent(): LoadingEvent {
  return { type: "LOADING" };
}

interface PlayingEvent {
  type: "PLAYING";
}
export function createPlayingEvent(): PlayingEvent {
  return { type: "PLAYING" };
}

interface StoppedEvent {
  type: "STOPPED";
}
export function createStoppedEvent(): StoppedEvent {
  return { type: "STOPPED" };
}

interface OnProgressEvent {
  type: "ON_PROGRESS";
  currentTime: number;
}
export function createOnProgressEvent(currentTime: number): OnProgressEvent {
  return { type: "ON_PROGRESS", currentTime };
}

interface InitializedEvent {
  type: "INITIALIZED";
}
export function createAudioInitialized(): InitializedEvent {
  return { type: "INITIALIZED" };
}

export type Event =
  | AudioUnsupportedEvent
  | MediaErrorEvent
  | LoadingEvent
  | PlayingEvent
  | StoppedEvent
  | OnProgressEvent
  | InitializedEvent
  | AudioInitializationErrorEvent;
