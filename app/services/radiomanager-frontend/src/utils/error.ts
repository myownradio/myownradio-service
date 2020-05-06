import { ILocaleKey } from "~/locales"
// import { AbstractErrorWithLocaleKey } from "~/services/errors"

export function getLocaleErrorKey(error: Error): ILocaleKey {
  return "api_error"
}
