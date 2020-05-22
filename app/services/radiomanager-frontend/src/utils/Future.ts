export enum FutureState {
  PENDING = "PENDING",
  READY = "READY",
  ERROR = "ERROR",
}

export interface Future<T> {
  asPromise(): Promise<T>
  asValue(): T
  map<R>(mapFn: (val: T) => R): Future<R>
}

type FutureStateObject<T> =
  | {
      state: FutureState.PENDING
      suspender: Promise<void>
    }
  | {
      state: FutureState.ERROR
      error: Error
    }
  | {
      state: FutureState.READY
      value: T
    }

export class IllegalStateError extends Error {
  constructor(message: string, readonly suspender: Promise<void>) {
    super(message)
  }
}

export class PromiseBasedFuture<T> implements Future<T> {
  private futureStateObject: FutureStateObject<T>

  constructor(private promise: Promise<T>) {
    this.futureStateObject = {
      state: FutureState.PENDING,
      suspender: this.promise.then(
        value => {
          this.futureStateObject = {
            state: FutureState.READY,
            value,
          }
        },
        error => {
          this.futureStateObject = {
            state: FutureState.ERROR,
            error,
          }
        },
      ),
    }
  }

  public map<R>(mapFn: (v: T) => R): Future<R> {
    return new PromiseBasedFuture<R>(this.promise.then(mapFn))
  }

  public asPromise(): Promise<T> {
    return this.promise
  }

  public asValue(): T {
    switch (this.futureStateObject.state) {
      case FutureState.PENDING:
        throw new IllegalStateError(`The future has not come yet`, this.futureStateObject.suspender)

      case FutureState.ERROR:
        throw this.futureStateObject.error

      case FutureState.READY:
        return this.futureStateObject.value
    }
  }
}

export function fromPromise<T>(promise: Promise<T>): Future<T> {
  return new PromiseBasedFuture(promise)
}

export function fromConstant<T>(value: T): Future<T> {
  return new PromiseBasedFuture(Promise.resolve(value))
}
