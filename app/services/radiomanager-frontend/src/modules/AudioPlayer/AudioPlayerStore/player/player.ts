import { Observable, Subject } from "rxjs";
import { Command } from "./commands";
import {
  createAudioUnsupportedEvent,
  createMediaErrorEvent,
  createPlayingEvent,
  createStoppedEvent,
  createAudioInitialized,
  createOnProgressEvent,
  createAudioInitializationErrorEvent,
  createLoadingEvent,
  Event,
} from "./events";

export function createAudioPlayer(command$: Observable<Command>, event$: Subject<Event>): () => void {
  let audioElement: HTMLAudioElement;
  try {
    audioElement = document.createElement("audio");
  } catch (error) {
    event$.next(createAudioInitializationErrorEvent(error.message));
    return (): void => {
      /* NOP */
    };
  }

  if (typeof audioElement.canPlayType !== "function") {
    event$.next(createAudioUnsupportedEvent());
  } else {
    event$.next(createAudioInitialized());
  }

  const timeUpdateListener = (): void => {
    event$.next(createOnProgressEvent(audioElement.currentTime));
  };

  const playListener = (): void => {
    event$.next(createLoadingEvent());
  };

  audioElement.addEventListener("timeupdate", timeUpdateListener);

  audioElement.addEventListener("play", playListener);

  const subscription = command$.subscribe(command => {
    switch (command.type) {
      case "PLAY":
        Promise.resolve()
          .then(() => {
            audioElement.setAttribute("src", command.payload.url);
            return audioElement.play();
          })
          .then(
            () => event$.next(createPlayingEvent()),
            error => event$.next(createMediaErrorEvent(error.message, command.payload.url)),
          );
        break;

      case "STOP":
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.removeAttribute("src");
        event$.next(createStoppedEvent());
        break;

      default:
    }
  });

  return function destroy(): void {
    audioElement.removeEventListener("timeupdate", timeUpdateListener);
    audioElement.removeEventListener("play", playListener);
    audioElement.remove();
    subscription.unsubscribe();
  };
}
