import { EventEmitter } from "events"
import { UserResource } from "@myownradio/shared-types"
import { AuthApiService } from "~/services/api/AuthApiService"
import { SessionService } from "~/services/session/SessionService"
import debug from "~/utils/debug"
import { fromValue } from "~/utils/suspense2"

export enum AuthenticationState {
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

export enum AuthenticationEvent {
  AUTHENTICATED = "AUTHENTICATED",
  LOGGED_OUT = "LOGGED_OUT",
}

export class AuthenticationModel {
  public authenticationState = fromValue<AuthenticationState>(AuthenticationState.UNAUTHENTICATED)
  public authenticationError = fromValue<Error | null>(null)
  public user = fromValue<UserResource | null>(null)

  private debug = debug.extend("AuthenticationModel")

  private emitter = new EventEmitter()

  constructor(private authApiService: AuthApiService, private sessionService: SessionService) {
    this.debug("Initialized")
  }

  public on(event: AuthenticationEvent, listener: () => void): () => void {
    this.emitter.addListener(event, listener)
    return (): void => {
      this.emitter.removeListener(event, listener)
    }
  }

  public tryAuthentication(): void {
    this.debug("Authenticating...")
    const mePromise = this.authApiService.me()

    this.user.replaceValue(mePromise.catch(() => null))
    this.authenticationState.replaceValue(
      mePromise
        .then(
          () => AuthenticationState.AUTHENTICATED,
          () => AuthenticationState.UNAUTHENTICATED,
        )
        .then(newState => {
          this.debug(`Authentication state changed to ${newState}`)
          return newState
        }),
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

    mePromise.then(() => this.emitter.emit(AuthenticationEvent.AUTHENTICATED))
  }

  public async login(email: string, password: string): Promise<void> {
    if ((await this.authenticationState.promise()) === AuthenticationState.AUTHENTICATED) {
      await this.logout()
    }

    const { access_token, refresh_token } = await this.authApiService.login(email, password)
    this.sessionService.saveTokens(access_token, refresh_token)
    this.tryAuthentication()
  }

  public async signup(email: string, password: string): Promise<void> {
    await this.authApiService.signup(email, password)
  }

  public async logout(): Promise<void> {
    if ((await this.authenticationState.promise()) === AuthenticationState.UNAUTHENTICATED) return

    this.sessionService.clearTokens()
    this.authenticationState.replaceValue(AuthenticationState.UNAUTHENTICATED)
    this.user.replaceValue(null)
    this.debug(`Authentication state changed to ${this.authenticationState}`)

    this.emitter.emit(AuthenticationEvent.LOGGED_OUT)
  }
}
