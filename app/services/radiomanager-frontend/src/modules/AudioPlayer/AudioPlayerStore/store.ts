import { BehaviorSubject, Subject } from "rxjs";
import { scan } from "rxjs/operators";
import { createAudioPlayer, Command, Event, playCommand, stopCommand } from "./player";
import { reducer } from "./reducer";
import { AudioPlayerState, initialAudioPlayerState } from "./state";

export interface AudioPlayerStore {
  state$: BehaviorSubject<AudioPlayerState>;
  play(url: string): void;
  stop(): void;
  shutdown(): void;
}

export function createStore(): AudioPlayerStore {
  const command$ = new Subject<Command>();
  const event$ = new Subject<Event>();
  const state$ = new BehaviorSubject<AudioPlayerState>(initialAudioPlayerState);

  const stateSubscription = event$.pipe(scan(reducer, initialAudioPlayerState)).subscribe(state$);

  const destroyPlayer = createAudioPlayer(command$, event$);

  return {
    state$,
    play(url: string): void {
      command$.next(playCommand(url));
    },
    stop(): void {
      command$.next(stopCommand());
    },
    shutdown(): void {
      stateSubscription.unsubscribe();
      destroyPlayer();
    },
  };
}
