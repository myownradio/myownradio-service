import { Observable, Subject } from "rxjs";
import { Command } from "./commands";
import {
  createAudioUnsupportedEvent,
  createMediaErrorEvent,
  createPlayingEvent,
  createStoppedEvent,
  createAudioInitialized,
  Event,
  createOnProgressEvent, createAudioInitializationErrorEvent,
} from "./events";

export function createAudioPlayer(command$: Observable<Command>, event$: Subject<Event>): () => void {
  let audioElement: HTMLAudioElement;
  try {
    audioElement = document.createElement("audio");
    event$.next(createAudioInitialized());
  } catch (error) {
    event$.next(createAudioInitializationErrorEvent(error.message));
    return (): void => {
      /* NOP */
    };
  }

  if (typeof audioElement.canPlayType !== "function") {
    event$.next(createAudioUnsupportedEvent());
  }

  const timeUpdateListener = (): void => {
    event$.next(createOnProgressEvent(audioElement.currentTime));
    console.log();
  };

  audioElement.addEventListener("timeupdate", timeUpdateListener);

  const subscription = command$.subscribe(command => {
    switch (command.type) {
      case "PLAY":
        audioElement.setAttribute("src", command.payload.url);
        audioElement.play().then(
          () => event$.next(createPlayingEvent()),
          error => event$.next(createMediaErrorEvent(error.message)),
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
    audioElement.remove();
    subscription.unsubscribe();
  };
}
