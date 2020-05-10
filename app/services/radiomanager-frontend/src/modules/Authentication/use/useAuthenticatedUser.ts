import { UserResource } from "@myownradio/domain/resources/UserResource"
import { useContext } from "react"
import { UnauthorizedError } from "~/modules/Authentication"
import { AuthenticatedUserContext } from "~/modules/Authentication/AuthenticatedUserProvider"

export function useAuthenticatedUser(): UserResource
export function useAuthenticatedUser(allowNull: false): UserResource
export function useAuthenticatedUser(allowNull: true): UserResource | null
export function useAuthenticatedUser(allowNull = false): UserResource | null {
  const probablyUser = useContext(AuthenticatedUserContext)

  if (probablyUser) {
    return probablyUser
  }

  if (allowNull) {
    return null
  }

  throw new UnauthorizedError()
}
