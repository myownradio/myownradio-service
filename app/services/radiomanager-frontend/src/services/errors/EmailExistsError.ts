import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class EmailExistsError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "email_exists";

  constructor(message: string | undefined) {
    super(message);
    Object.setPrototypeOf(this, EmailExistsError.prototype);
  }
}
