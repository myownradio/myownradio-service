import { ILocaleKey } from "~/locales";

export type IErrorReason = "unauthorized" | "unknown" | "bad_request" | "email_exists";

export default abstract class AbstractErrorWithReason extends Error {
  protected abstract reason: IErrorReason;

  protected constructor(message: string, protected localeKey: ILocaleKey) {
    super(message);
  }
}
