import { ILocaleKey } from "~/locales";
import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class UnknownError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unknown";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
