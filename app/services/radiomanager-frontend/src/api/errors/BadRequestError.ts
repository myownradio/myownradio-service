import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class BadRequestError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "bad_request";

  constructor(message: string | undefined) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
