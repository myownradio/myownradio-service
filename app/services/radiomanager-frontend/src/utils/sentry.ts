import { init as initSentry, captureException } from "@sentry/browser"
import { Env } from "~/env"

export function init(env: Env): void {
  initSentry({
    enabled: !!env.REACT_APP_SENTRY_DSN,
    dsn: env.REACT_APP_SENTRY_DSN,
  })
}

export function captureError(error: Error): void {
  captureException(error)
}

export function shortCircuit(cb: () => Promise<void>): () => void
export function shortCircuit<A extends unknown>(cb: (a: A) => Promise<void>): (a: A) => void
export function shortCircuit<A extends unknown, B extends unknown>(
  cb: (a: A, b: B, ...args: unknown[]) => Promise<void>,
): (a: A, b: B, ...args: unknown[]) => void {
  return (a, b, ...args: unknown[]): void => {
    cb(a, b, ...args).catch(captureException)
  }
}
