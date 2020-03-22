import { ILocaleKey } from "~/locales";

import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class BadRequestError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "bad_request";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
