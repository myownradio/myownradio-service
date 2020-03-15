import { Type } from "io-ts";
import { isRight } from "fp-ts/lib/Either";

export interface StorageService {
  get<T>(key: string, contract: Type<T, unknown>, defaultValue: T): T;
  put<T>(key: string, value: T): void;
}

class LocalStorageService implements StorageService {
  public get<T>(key: string, contract: Type<T, unknown>, defaultValue: T): T {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue !== null) {
      try {
        const value = JSON.parse(rawValue);
        const decodedEither = contract.decode(value);
        if (isRight(decodedEither)) {
          return decodedEither.right;
        }
      } catch {}
    }
    return defaultValue;
  }

  public put<T>(key: string, value: T): void {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
  }
}

class MemoryStorageService implements StorageService {
  private storage = new Map();

  public get<T>(key: string, contract: Type<T, unknown>, defaultValue: T): T {
    return this.storage.has(key) ? this.storage.get(key) : defaultValue;
  }

  public put<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }
}

function isLocalStorageAvailable(): boolean {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function createStorageService(): StorageService {
  return isLocalStorageAvailable() ? new LocalStorageService() : new MemoryStorageService();
}
