import { ILocaleKey } from "~/locales";

import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class EmailExistsError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "email_exists";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, EmailExistsError.prototype);
  }
}
