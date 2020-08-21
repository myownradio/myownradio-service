import { AppEvent } from "../events"

export interface EventEmitterService {
  emitEvent(event: AppEvent): void
}
