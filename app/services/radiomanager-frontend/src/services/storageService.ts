export interface StorageService {
  get<T>(key: string): T | null;
  put<T>(key: string, value: T): void;
  delete<T>(key: string): void;
}

class LocalStorageService implements StorageService {
  public get<T>(key: string): T | null {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue !== null) {
      try {
        return JSON.parse(rawValue);
      } catch {}
    }
    return null;
  }

  public put<T>(key: string, value: T): void {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
  }

  delete<T>(key: string): void {
    window.localStorage.removeItem(key);
  }
}

class MemoryStorageService implements StorageService {
  private storage = new Map();

  public get<T>(key: string): T | null {
    return this.storage.has(key) ? this.storage.get(key) : null;
  }

  public put<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  delete<T>(key: string): void {
    this.storage.delete(key);
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
