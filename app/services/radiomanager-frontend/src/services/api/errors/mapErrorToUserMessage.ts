import UnauthorizedApiError from "~/services/api/errors/UnauthorizedApiError"
import getText from "~/utils/getText"

const DEFAULT_MESSAGE = getText("We're sorry, but something went wrong on our side. Please, try again later.")

export function mapLoginErrorToUserMessage(error: Error): string {
  if (error instanceof UnauthorizedApiError) {
    return getText("Your email or password do not match.")
  }

  return DEFAULT_MESSAGE
}
