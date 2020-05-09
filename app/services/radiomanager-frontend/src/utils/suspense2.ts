import { EventEmitter } from "events"
import Debug from "~/utils/debug"

const debug = Debug.extend("Resource")

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
  read(): T
  subscribe(fn: Subscriber): Unsubscribe
  enqueueMutation(mutator: Mutator<T> | AsyncMutator<T>): void
  replaceValue(value: T | PromiseLike<T>): void
}

export function fromValue<T>(initialValue: T | PromiseLike<T>): Resource<T> {
  debug("Initialize resource object")
  const emitter = new EventEmitter()
  const mutators: Array<Mutator<T> | AsyncMutator<T>> = []

  let state = SuspendableState.PENDING
  let value: T
  let error: unknown
  let suspender: Promise<void>

  const wrapValue = (valueToWrap: T | PromiseLike<T>): void => {
    state = SuspendableState.PENDING
    debug(`Changed state to ${state}`)
    suspender = Promise.resolve(valueToWrap).then(
      async val => {
        value = val
        while (mutators.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const mutator = mutators.shift()!
          value = await mutator(value)
        }
        state = SuspendableState.RESOLVED
        debug(`Changed state to ${state}`)
      },
      err => {
        state = SuspendableState.REJECTED
        debug(`Changed state to ${state}`)
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

  return {
    read,
    subscribe,
    replaceValue,
    enqueueMutation,
  }
}

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
