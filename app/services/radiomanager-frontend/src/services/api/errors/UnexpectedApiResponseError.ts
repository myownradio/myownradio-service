import AbstractApiError from "./AbstractApiError"

export default class UnexpectedApiResponseError extends AbstractApiError {
  constructor(status: number) {
    super(status)
    Object.setPrototypeOf(this, UnexpectedApiResponseError.prototype)
  }
}
