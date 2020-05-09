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
  public authenticationState = AuthenticationState.PENDING
  public user = fromValue<UserResource | null>(this.authApiService.me())

  private debug = debug.extend("AuthenticationModel")

  constructor(private authApiService: AuthApiService, private sessionService: SessionService) {
    this.tryAuthentication()
  }

  private tryAuthentication(): void {
    this.user
      .promise()
      .then(
        () => (this.authenticationState = AuthenticationState.AUTHENTICATED),
        () => {
          this.user.replaceValue(null)
          this.authenticationState = AuthenticationState.UNAUTHENTICATED
        },
      )
      .then(() => {
        this.debug(`Authentication state changed to ${this.authenticationState}`)
      })
  }

  public async login(email: string, password: string): Promise<void> {
    if (this.authenticationState === AuthenticationState.AUTHENTICATED) return

    const { access_token, refresh_token } = await this.authApiService.login(email, password)
    this.sessionService.saveTokens(access_token, refresh_token)
    this.user.replaceValue(this.authApiService.me())
    this.tryAuthentication()
  }

  public async logout(): Promise<void> {
    if (this.authenticationState === AuthenticationState.UNAUTHENTICATED) return

    this.sessionService.clearTokens()
    this.authenticationState = AuthenticationState.UNAUTHENTICATED
    this.user.replaceValue(null)
    this.debug(`Authentication state changed to ${this.authenticationState}`)
  }
}
