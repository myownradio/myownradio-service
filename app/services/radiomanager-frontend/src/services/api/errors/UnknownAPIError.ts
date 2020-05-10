import AbstractApiError from "./AbstractApiError"

export default class UnknownAPIError extends AbstractApiError {
  constructor(status: number) {
    super(status)
    Object.setPrototypeOf(this, UnknownAPIError.prototype)
  }
}
