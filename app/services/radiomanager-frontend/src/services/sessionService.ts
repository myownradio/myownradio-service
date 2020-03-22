import { AuthApiService } from "./authApiService";
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

  public saveTokens(accessToken: string, refreshToken: string): void {
    this.storageService.put("access_token", accessToken);
    this.storageService.put("refresh_token", refreshToken);
  }

  public clearTokens(): void {
    this.storageService.delete("access_token");
    this.storageService.delete("refresh_token");
  }
}
