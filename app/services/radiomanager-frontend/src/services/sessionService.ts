import { StorageService } from "./storageService";
import { AuthApiService } from "./authApiService";
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "../common/constants";

export interface SessionService {
  getAccessToken(): string | null;
  refreshToken(): Promise<void>;
}

export class BasicSessionService implements SessionService {
  private authApiClient: AuthApiService | undefined;

  constructor(private storageService: StorageService) {}

  public setAuthApiClient(apiAuthClient: AuthApiService): void {
    this.authApiClient = apiAuthClient;
  }

  public getAccessToken(): string | null {
    return this.storageService.get(ACCESS_TOKEN_STORAGE_KEY);
  }

  public async refreshToken(): Promise<void> {
    const refreshToken = this.storageService.get<string>(REFRESH_TOKEN_STORAGE_KEY);
    if (refreshToken && this.authApiClient) {
      const newTokens = await this.authApiClient.refreshRefreshToken(refreshToken);
      this.storageService.put(REFRESH_TOKEN_STORAGE_KEY, newTokens.refresh_token);
      this.storageService.put(ACCESS_TOKEN_STORAGE_KEY, newTokens.access_token);
    }
  }
}
