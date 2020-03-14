import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class UnknownError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unknown";
}
