import { TokenService } from "~/services/tokenService";
import nop from "~/services/utils/nop";

import { StorageService } from "./storageService";

export interface SessionService {
  getAccessToken(): string | null;
  refreshToken(): Promise<void>;
  saveTokens(accessToken: string, refreshToken: string): void;
  clearTokens(): void;
}

const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

export class BasicSessionService implements SessionService {
  constructor(private storageService: StorageService, private tokenService: TokenService) {}

  public getAccessToken(): string | null {
    return this.storageService.get(ACCESS_TOKEN_STORAGE_KEY);
  }

  public async refreshToken(): Promise<void> {
    const refreshToken = this.storageService.get<string>(REFRESH_TOKEN_STORAGE_KEY);
    if (refreshToken) {
      const newTokens = await this.tokenService.refreshRefreshToken(refreshToken);
      this.storageService.put(REFRESH_TOKEN_STORAGE_KEY, newTokens.refresh_token);
      this.storageService.put(ACCESS_TOKEN_STORAGE_KEY, newTokens.access_token);
    }
  }

  public saveTokens(accessToken: string, refreshToken: string): void {
    this.storageService.put(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    this.storageService.put(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }

  public clearTokens(): void {
    const currentRefreshToken = this.storageService.get<string>(REFRESH_TOKEN_STORAGE_KEY);

    if (currentRefreshToken) {
      this.tokenService.forgotRefreshToken(currentRefreshToken).catch(nop);
    }

    this.storageService.delete(ACCESS_TOKEN_STORAGE_KEY);
    this.storageService.delete(REFRESH_TOKEN_STORAGE_KEY);
  }
}
