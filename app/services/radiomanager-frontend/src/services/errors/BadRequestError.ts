import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";
import { ILocaleKey } from "~/locales";

export default class BadRequestError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "bad_request";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
