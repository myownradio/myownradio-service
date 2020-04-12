import { ILocaleKey } from "~/locales";
import AbstractErrorWithLocaleKey, { IErrorReason } from "./AbstractErrorWithLocaleKey";

export default class UnauthorizedError extends AbstractErrorWithLocaleKey {
  protected reason: IErrorReason = "unauthorized";

  constructor(message: string, localeKey: ILocaleKey) {
    super(message, localeKey);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
