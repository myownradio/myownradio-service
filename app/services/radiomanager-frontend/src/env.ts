import * as t from "io-ts"

const EnvContract = t.readonly(
  t.interface({
    SENTRY_DSN: t.union([t.string, t.undefined]),
  }),
  "EnvContract",
)
export type Env = t.TypeOf<typeof EnvContract>

export function env(): Env {
  return {
    SENTRY_DSN: process.env.SENTRY_DSN,
  }
}
