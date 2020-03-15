export type IErrorReason = "unauthorized" | "unknown" | "bad_request";

export default abstract class AbstractErrorWithReason extends Error {
  protected abstract reason: IErrorReason;
}
