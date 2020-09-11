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
