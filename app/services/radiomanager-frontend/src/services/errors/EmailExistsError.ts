import { ILocaleKey } from "~/locales"
import AbstractErrorWithLocaleKey, { IErrorReason } from "./AbstractErrorWithLocaleKey"

export default class EmailExistsError extends AbstractErrorWithLocaleKey {
  protected reason: IErrorReason = "email_exists"

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey)
    Object.setPrototypeOf(this, EmailExistsError.prototype)
  }
}
