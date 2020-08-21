import { EventEmitterService, AppEvent } from "@myownradio/shared-types"

export class VoidEventEmitterService implements EventEmitterService {
  public emitEvent(event: AppEvent): void {
    void event
    // NOP
  }
}
