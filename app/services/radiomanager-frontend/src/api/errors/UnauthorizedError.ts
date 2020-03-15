import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class UnauthorizedError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unauthorized";

  constructor(message: string | undefined) {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
