import UnauthorizedApiError from "~/services/api/errors/UnauthorizedApiError"
import UnexpectedApiResponseError from "~/services/api/errors/UnexpectedApiResponseError"
import getText from "~/utils/getText"

const DEFAULT_MESSAGE = getText("We're sorry, but something went wrong on our side. Please, try again later.")

interface Errors {
  [field: string]: string
}

export function mapLoginErrorToUserMessage(error: Error): Errors {
  if (error instanceof UnauthorizedApiError) {
    return { root: getText("Your email or password do not match.") }
  }

  if (error instanceof UnexpectedApiResponseError) {
    switch (error.status) {
      case 400:
        return { root: getText("You should specify valid email and password.") }
    }
  }

  return { root: DEFAULT_MESSAGE }
}

export function mapSignupErrorToUserMessage(error: Error): Errors {
  if (error instanceof UnexpectedApiResponseError) {
    switch (error.status) {
      case 409:
        return { email: getText("This email address is already in use.") }
      case 400:
        return { root: getText("You should specify valid email and password.") }
    }
  }

  return { root: DEFAULT_MESSAGE }
}
