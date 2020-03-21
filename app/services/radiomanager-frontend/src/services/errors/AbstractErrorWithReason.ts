export type IErrorReason = "unauthorized" | "unknown" | "bad_request" | "email_exists";

export default abstract class AbstractErrorWithReason extends Error {
  protected abstract reason: IErrorReason;
}
