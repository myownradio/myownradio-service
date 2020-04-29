import { AbstractAPIError } from "~/root/services/api/errors/AbstractAPIError"

export class UnauthorizedAPIError extends AbstractAPIError {
  constructor() {
    super(401)
  }
}
