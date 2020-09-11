import * as t from "io-ts"

const EnvContract = t.interface({}, "EnvContract")
export type Env = t.TypeOf<typeof EnvContract>

export function env(): Env {
  return {}
}
