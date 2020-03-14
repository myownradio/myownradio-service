import AbstractErrorWithReason, { IErrorReason } from "./AbstractErrorWithReason";

export default class UnauthorizedError extends AbstractErrorWithReason {
  protected reason: IErrorReason = "unauthorized";
}
