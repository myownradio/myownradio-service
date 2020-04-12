import { ILocaleKey } from "~/locales";
import AbstractErrorWithLocaleKey, { IErrorReason } from "./AbstractErrorWithLocaleKey";

export default class BadRequestError extends AbstractErrorWithLocaleKey {
  protected reason: IErrorReason = "bad_request";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
