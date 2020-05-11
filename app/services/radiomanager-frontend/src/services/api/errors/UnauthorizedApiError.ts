import AbstractApiError from "./AbstractApiError"

export default class UnauthorizedApiError extends AbstractApiError {
  constructor() {
    super(401)
    Object.setPrototypeOf(this, UnauthorizedApiError.prototype)
  }
}
