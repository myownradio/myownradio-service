import { init as initSentry, captureException } from "@sentry/browser"
import { Env } from "~/env"

export function init(env: Env): void {
  initSentry({
    enabled: !!env.SENTRY_DSN,
    dsn: env.SENTRY_DSN,
  })
}

export function captureError(error: Error): void {
  captureException(error)
}

export function shortCircuit<A extends unknown>(cb: (a: A) => Promise<unknown>): (a: A) => void
export function shortCircuit(cb: () => Promise<unknown>): () => void
export function shortCircuit(cb: (...args: unknown[]) => Promise<unknown>): (...args: unknown[]) => void {
  return (...args: unknown[]): void => {
    cb(...args).catch(captureException)
  }
}
