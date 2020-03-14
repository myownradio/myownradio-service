export type IErrorReason = "unauthorized" | "unknown";

export default abstract class AbstractErrorWithReason extends Error {
  protected abstract reason: IErrorReason;
}
