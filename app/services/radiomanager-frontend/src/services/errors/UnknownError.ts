import { ILocaleKey } from "~/locales"
import AbstractErrorWithLocaleKey, { IErrorReason } from "./AbstractErrorWithLocaleKey"

export default class UnknownError extends AbstractErrorWithLocaleKey {
  protected reason: IErrorReason = "unknown"

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey)
    Object.setPrototypeOf(this, UnknownError.prototype)
  }
}
