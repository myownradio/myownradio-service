import { EventEmitter } from "events"
import * as PropTypes from "prop-types"

export enum ResourceState {
  Pending,
  Success,
  Error,
}

export interface Resource<T> {
  read: () => T
}

type Mutator<T> = (t: T) => T

export interface MutableResource<T> extends Resource<T> {
  subscribe(cb: (t: T) => void): () => void
  mutate(mapFn: Mutator<T>): void
}

export const resource = PropTypes.shape({
  read: PropTypes.func.isRequired,
})

export function wrapPromise<T>(promise: Promise<T>): MutableResource<T> {
  const mutators: Mutator<T>[] = []
  const emitter = new EventEmitter()

  let status = ResourceState.Pending
  let response: T | Error

  const suspender = promise.then(
    res => {
      status = ResourceState.Success
      response = res
      while (mutators.length > 0) {
        const mutFn = mutators.shift() as Mutator<T>
        response = mutFn(response as T)
      }
    },
    err => {
      status = ResourceState.Error
      response = err
    },
  )

  const read = (): T => {
    switch (status) {
      case ResourceState.Pending:
        throw suspender
      case ResourceState.Error:
        throw response
      default:
        return response as T
    }
  }

  const mutate = (mutFn: (t: T) => T): void => {
    if (status === ResourceState.Error) {
      // todo Throw error about illegal state.
      return
    }

    if (status === ResourceState.Success) {
      response = mutFn(response as T)
      emitter.emit("mutate")
      return
    }

    if (status === ResourceState.Pending) {
      mutators.push(mutFn)
      return
    }
  }

  const subscribe = (cb: (t: T) => void): (() => void) => {
    emitter.addListener("mutate", cb)
    return (): void => {
      emitter.removeListener("mutate", cb)
    }
  }

  return { read, mutate, subscribe }
}
