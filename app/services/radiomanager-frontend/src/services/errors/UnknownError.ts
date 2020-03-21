import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";
import { ILocaleKey } from "~/locales";

export default class UnknownError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unknown";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
