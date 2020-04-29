import { AbstractAPIError } from "~/root/services/api/errors/AbstractAPIError"

export class UnknownAPIError extends AbstractAPIError {
  constructor(status: number) {
    super(status)
  }
}
