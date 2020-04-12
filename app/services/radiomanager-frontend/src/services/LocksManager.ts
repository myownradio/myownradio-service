import { LoggerService } from "~/services/logger/LoggerService";

export interface LocksManager {
  lock(fn: () => Promise<void>): Promise<void>;
}

/**
 * This is my limited implementation of Locks manager for browsers.
 * I implemented my own because this technology is experimental yet.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/LockManager
 */
export class NaiveLocksManager implements LocksManager {
  private locked = false;
  private waitList: Array<(error?: Error) => void> = [];

  constructor(private lockId: string, private loggerService: LoggerService) {}

  async lock(fn: () => Promise<void>): Promise<void> {
    if (this.locked) {
      this.loggerService.info("Sensitive operation already in progress. Waiting for finish.", {
        lockId: this.lockId,
      });
      return new Promise((resolve, reject) => {
        this.waitList.push(error => (error ? reject(error) : resolve()));
      });
    }

    this.locked = true;
    try {
      this.loggerService.info("Performing sensitive operation.", {
        lockId: this.lockId,
      });
      await fn();
      this.loggerService.info("Sensitive operation finished.", {
        lockId: this.lockId,
        waitListSize: this.waitList.length,
      });
      this.waitList.forEach(cb => cb());
    } catch (error) {
      this.loggerService.error("Sensitive operation failed.", {
        error,
        lockId: this.lockId,
        waitListSize: this.waitList.length,
      });
      this.waitList.forEach(cb => cb(error));
    } finally {
      this.waitList = [];
      this.locked = false;
    }
  }
}

export function createLocksManager(lockId: string, loggerService: LoggerService): LocksManager {
  return new NaiveLocksManager(lockId, loggerService);
}
