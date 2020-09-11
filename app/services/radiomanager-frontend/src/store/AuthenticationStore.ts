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
  abstract authentication: AuthenticationState
  abstract user: UserResource | null

  public abstract init(): Promise<void>

  public abstract login(email: string, password: string): Promise<void>
  public abstract logout(): Promise<void>
  public abstract signup(email: string, password: string): Promise<void>
}

@injectable()
export class AuthenticationStoreImpl implements AuthenticationStore {
  @observable public authentication: AuthenticationState = AuthenticationState.UNAUTHENTICATED
  @observable public user: UserResource | null = null

  private debug = Debug.extend("AuthenticationStoreImpl")

  constructor(private authApiService: AuthApiService, private sessionService: SessionService) {}

  public async init(): Promise<void> {
    await this.tryAuthenticate()
  }

  private async tryAuthenticate(): Promise<void> {
    try {
      const user = await this.authApiService.me()
      runInAction(() => {
        this.authentication = AuthenticationState.AUTHENTICATED
        this.user = user
      })
    } catch (error) {
      if (!(error instanceof UnauthorizedApiError)) {
        throw error
      }
      runInAction(() => {
        this.authentication = AuthenticationState.UNAUTHENTICATED
        this.user = null
      })
    }
  }

  public async login(email: string, password: string): Promise<void> {
    if (this.authentication === AuthenticationState.AUTHENTICATED) {
      this.debug("Login: already logged in")
      return
    }

    this.debug("Login", { email, password })

    const { access_token, refresh_token } = await this.authApiService.login(email, password)
    this.sessionService.saveTokens(access_token, refresh_token)
    await this.tryAuthenticate()
  }

  public async logout(): Promise<void> {
    if (this.authentication === AuthenticationState.UNAUTHENTICATED) {
      this.debug("Logout: already logged out")
      return
    }

    this.debug("Logout")

    this.sessionService.clearTokens()

    runInAction(() => {
      this.authentication = AuthenticationState.UNAUTHENTICATED
      this.user = null
    })
  }

  public async signup(email: string, password: string): Promise<void> {
    await this.authApiService.signup(email, password)
  }
}
