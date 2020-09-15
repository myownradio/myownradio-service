import { injectable } from "inversify"
import { TokenService } from "~/services/api/TokenService"
import { LockManager, NaiveLockManager } from "~/services/utils/LockManager"
import { nop } from "~/utils/fn"
import { StorageService } from "../storage/StorageService"

export abstract class SessionService {
  public abstract getAccessToken(): string | null
  public abstract refreshToken(): Promise<void>
  public abstract saveTokens(accessToken: string, refreshToken: string): void
  public abstract clearTokens(): void
}

const ACCESS_TOKEN_STORAGE_KEY = "access_token"
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token"

@injectable()
export class BaseSessionService implements SessionService {
  private locksManager: LockManager = new NaiveLockManager()

  constructor(private storageService: StorageService, private tokenService: TokenService) {}

  public getAccessToken(): string | null {
    return this.storageService.get(ACCESS_TOKEN_STORAGE_KEY)
  }

  public async refreshToken(): Promise<void> {
    await this.locksManager.lock(async () => {
      const refreshToken = this.storageService.get<string>(REFRESH_TOKEN_STORAGE_KEY)
      if (refreshToken) {
        const newTokens = await this.tokenService.refreshRefreshToken(refreshToken)
        this.storageService.put(REFRESH_TOKEN_STORAGE_KEY, newTokens.refresh_token)
        this.storageService.put(ACCESS_TOKEN_STORAGE_KEY, newTokens.access_token)
      }
    })
  }

  public saveTokens(accessToken: string, refreshToken: string): void {
    this.storageService.put(ACCESS_TOKEN_STORAGE_KEY, accessToken)
    this.storageService.put(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
  }

  public clearTokens(): void {
    const currentRefreshToken = this.storageService.get<string>(REFRESH_TOKEN_STORAGE_KEY)

    if (currentRefreshToken) {
      this.tokenService.forgotRefreshToken(currentRefreshToken).catch(nop)
    }

    this.storageService.delete(ACCESS_TOKEN_STORAGE_KEY)
    this.storageService.delete(REFRESH_TOKEN_STORAGE_KEY)
  }
}

export function createSessionService(storageService: StorageService, tokenService: TokenService): SessionService {
  return new BaseSessionService(storageService, tokenService)
}
