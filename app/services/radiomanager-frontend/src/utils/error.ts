import { ILocaleKey } from "~/locales"
import { AbstractErrorWithLocaleKey } from "~/services/errors"

export function getLocaleErrorKey(error: Error): ILocaleKey {
  return error instanceof AbstractErrorWithLocaleKey ? error.localeKey : "api_error"
}
