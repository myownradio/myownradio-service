import { UserResource } from "@myownradio/domain/resources/UserResource"
import { AuthApiService } from "~/services/api/AuthApiService"
import { SessionService } from "~/services/session/SessionService"
import debug from "~/utils/debug"
import { fromValue } from "~/utils/suspense2"

export enum AuthenticationState {
  PENDING = "PENDING",
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

export class AuthenticationModel {
  public authenticationState = fromValue<AuthenticationState>(AuthenticationState.UNAUTHENTICATED)
  public authenticationError = fromValue<Error | null>(null)
  public user = fromValue<UserResource | null>(null)

  private debug = debug.extend("AuthenticationModel")

  constructor(private authApiService: AuthApiService, private sessionService: SessionService) {
    this.debug("Initialized")
  }

  public tryAuthentication(): void {
    this.debug("Authenticating...")
    const mePromise = this.authApiService.me()

    this.user.replaceValue(mePromise)
    this.authenticationState.replaceValue(
      mePromise.then(
        () => {
          this.debug(`Authentication state changed to ${AuthenticationState.AUTHENTICATED}`)
          return AuthenticationState.AUTHENTICATED
        },
        () => {
          this.debug(`Authentication state changed to ${AuthenticationState.UNAUTHENTICATED}`)
          return AuthenticationState.UNAUTHENTICATED
        },
      ),
    )
    this.authenticationError.replaceValue(
      mePromise.then(
        () => null,
        error => {
          this.debug(`Authentication failed`, { error })
          return error
        },
      ),
    )
  }

  public async login(email: string, password: string): Promise<void> {
    if ((await this.authenticationState.promise()) === AuthenticationState.AUTHENTICATED) return

    const { access_token, refresh_token } = await this.authApiService.login(email, password)
    this.sessionService.saveTokens(access_token, refresh_token)
    this.tryAuthentication()
  }

  public async logout(): Promise<void> {
    if ((await this.authenticationState.promise()) === AuthenticationState.UNAUTHENTICATED) return

    this.sessionService.clearTokens()
    this.authenticationState.replaceValue(AuthenticationState.UNAUTHENTICATED)
    this.user.replaceValue(null)
    this.debug(`Authentication state changed to ${this.authenticationState}`)
  }
}
