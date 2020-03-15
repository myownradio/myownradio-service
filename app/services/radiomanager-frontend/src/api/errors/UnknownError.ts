import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class UnknownError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unknown";

  constructor(message: string | undefined) {
    super(message);
    Object.setPrototypeOf(this, UnknownError.prototype);
  }
}
