import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";
import { ILocaleKey } from "~/locales";

export default class UnauthorizedError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unauthorized";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
