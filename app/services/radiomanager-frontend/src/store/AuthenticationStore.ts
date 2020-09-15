import { UserResource } from "@myownradio/shared-types"
import { injectable } from "inversify"
import { observable, runInAction } from "mobx"
import { AuthApiService } from "~/services/api/AuthApiService"
import UnauthorizedApiError from "~/services/api/errors/UnauthorizedApiError"
import { SessionService } from "~/services/session/SessionService"
import Debug from "~/utils/debug"

enum AuthenticationState {
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

export abstract class AuthenticationStore {
  abstract authentication: Promise<AuthenticationState>
  abstract user: Promise<UserResource | null>

  public abstract init(): Promise<void>

  public abstract login(email: string, password: string): Promise<void>
  public abstract logout(): Promise<void>
  public abstract signup(email: string, password: string): Promise<void>
}

@injectable()
export class AuthenticationStoreImpl implements AuthenticationStore {
  @observable public authentication: Promise<AuthenticationState> = Promise.resolve(AuthenticationState.UNAUTHENTICATED)
  @observable public user: Promise<UserResource | null> = Promise.resolve(null)

  private debug = Debug.extend("AuthenticationStoreImpl")

  constructor(private authApiService: AuthApiService, private sessionService: SessionService) {}

  public async init(): Promise<void> {
    await this.tryAuthenticate()
  }

  private async tryAuthenticate(): Promise<void> {
    const user = this.authApiService.me()

    runInAction(() => {
      this.authentication = user.then(
        () => AuthenticationState.AUTHENTICATED,
        () => AuthenticationState.UNAUTHENTICATED,
      )
      this.user = user.catch(() => null)
    })

    await user.catch(error => {
      if (!(error instanceof UnauthorizedApiError)) {
        throw error
      }
    })
  }

  public async login(email: string, password: string): Promise<void> {
    if ((await this.authentication) === AuthenticationState.AUTHENTICATED) {
      this.debug("Login: already logged in")
      return
    }

    this.debug("Login", { email, password })

    const { access_token, refresh_token } = await this.authApiService.login(email, password)

    this.sessionService.saveTokens(access_token, refresh_token)

    await this.tryAuthenticate()
  }

  public async logout(): Promise<void> {
    if ((await this.authentication) === AuthenticationState.UNAUTHENTICATED) {
      this.debug("Logout: already logged out")
      return
    }

    this.debug("Logout")

    this.sessionService.clearTokens()

    runInAction(() => {
      this.authentication = Promise.resolve(AuthenticationState.UNAUTHENTICATED)
      this.user = Promise.resolve(null)
    })
  }

  public async signup(email: string, password: string): Promise<void> {
    await this.authApiService.signup(email, password)
  }
}
