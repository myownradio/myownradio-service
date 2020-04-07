import AbstractErrorWithReason from "~/services/errors/AbstractErrorWithReason";

export function getLocalizedErrorKey(error: Error): string {
  return error instanceof AbstractErrorWithReason ? error.localeKey : error.message;
}
