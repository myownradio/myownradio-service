import { EventEmitter } from "events"
import { useEffect, useReducer } from "react"

export enum SuspendableState {
  PENDING = "PENDING",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export type Unsubscribe = () => void
export type Mutator<T> = (t: T) => T
export type AsyncMutator<T> = (t: T) => Promise<T>
export type Subscriber = () => void

export interface Resource<T> {
  promise(): Promise<T>
  read(): T
  subscribe(fn: Subscriber): Unsubscribe
  enqueueMutation(mutator: Mutator<T> | AsyncMutator<T>): void
  replaceValue(value: T | PromiseLike<T>): void
}

export function fromValue<T>(initialValue: null): Resource<T>
export function fromValue<T>(initialValue: T | PromiseLike<T>): Resource<T>
export function fromValue<T>(initialValue: T | PromiseLike<T>): Resource<T> {
  const emitter = new EventEmitter()
  const mutators: Array<Mutator<T> | AsyncMutator<T>> = []

  let state = SuspendableState.PENDING
  let value: T
  let error: unknown
  let suspender: Promise<void>
  let transaction = 0

  const wrapValue = (valueToWrap: T | PromiseLike<T>): void => {
    transaction += 1
    const currentTransaction = transaction

    state = SuspendableState.PENDING
    suspender = Promise.resolve(valueToWrap).then(
      async val => {
        if (transaction > currentTransaction) return
        value = val
        while (mutators.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const mutator = mutators.shift()!
          value = await mutator(value)
        }
        state = SuspendableState.RESOLVED
      },
      err => {
        if (transaction > currentTransaction) return
        state = SuspendableState.REJECTED
        error = err
      },
    )
  }

  wrapValue(initialValue)

  const subscribe = (fn: Subscriber): Unsubscribe => {
    emitter.addListener("update", fn)
    return (): void => {
      emitter.removeListener("update", fn)
    }
  }

  const read = (): T => {
    switch (state) {
      case SuspendableState.RESOLVED:
        return value
      case SuspendableState.PENDING:
        throw suspender
      case SuspendableState.REJECTED:
        throw error
    }
  }

  const replaceValue = (newValue: T | PromiseLike<T>): void => {
    wrapValue(newValue)
    emitter.emit("update")
  }

  const enqueueMutation = (mutator: Mutator<T> | AsyncMutator<T>): void => {
    switch (state) {
      case SuspendableState.RESOLVED:
      case SuspendableState.REJECTED:
        replaceValue(mutator(value))
        break
      case SuspendableState.PENDING:
        mutators.push(mutator)
        break
    }
  }

  const promise = async (): Promise<T> => {
    try {
      return read()
    } catch (error) {
      if ("then" in error) {
        await error
        return read()
      }
      throw error
    }
  }

  return {
    promise,
    read,
    subscribe,
    replaceValue,
    enqueueMutation,
  }
}

/**
 * @deprecated
 */
export async function unwrapValue<T>(resource: Resource<T>): Promise<T> {
  try {
    return resource.read()
  } catch (error) {
    if (!("then" in error)) {
      throw error
    }
    return error.then(() => unwrapValue(resource))
  }
}

export function useResource<T>(resource: Resource<T>): T {
  const [, update] = useReducer(it => it + 1, 0)

  useEffect(() => {
    return resource.subscribe(() => {
      update()
    })
  }, [resource])

  return resource.read()
}
