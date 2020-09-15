import * as t from "io-ts"
import { PathReporter } from "io-ts/lib/PathReporter"

const EnvContract = t.readonly(
  t.interface({
    REACT_APP_SITE_URL: t.string,
    REACT_APP_AUTH_API_URL: t.string,
    REACT_APP_AUDIO_UPLOADER_URL: t.string,
    REACT_APP_RADIO_MANAGER_URL: t.string,
    REACT_APP_AUDIO_PLAYER_URL: t.string,
    REACT_APP_SCHEDULER_URL: t.string,
    REACT_APP_SENTRY_DSN: t.string,
  }),
  "EnvContract",
)
export type Env = t.TypeOf<typeof EnvContract>

export function env(): Env {
  const decodeResult = EnvContract.decode({
    REACT_APP_SITE_URL: process.env.REACT_APP_SITE_URL,
    REACT_APP_AUTH_API_URL: process.env.REACT_APP_AUTH_API_URL,
    REACT_APP_AUDIO_UPLOADER_URL: process.env.REACT_APP_AUDIO_UPLOADER_URL,
    REACT_APP_RADIO_MANAGER_URL: process.env.REACT_APP_RADIO_MANAGER_URL,
    REACT_APP_AUDIO_PLAYER_URL: process.env.REACT_APP_AUDIO_PLAYER_URL,
    REACT_APP_SCHEDULER_URL: process.env.REACT_APP_SCHEDULER_URL,
    REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  })

  if (decodeResult._tag === "Left") {
    throw new Error(JSON.stringify(PathReporter.report(decodeResult), null, 2))
  }

  return decodeResult.right
}
