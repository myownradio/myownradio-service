import { ILocaleKey } from "~/locales";
import AbstractErrorWithReason from "~/services/errors/AbstractErrorWithReason";

export function getLocalizedErrorKey(error: Error): ILocaleKey {
  return error instanceof AbstractErrorWithReason ? error.localeKey : "api_error";
}
