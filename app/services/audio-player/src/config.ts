export class Config {
  readonly httpServerPort: number;
  readonly tokenSecret: string;
  readonly allowedOrigin: string;
  readonly databaseUrl: string;
  readonly databaseClient: string;

  constructor(env: { [name: string]: string | undefined }) {
    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080;

    if (!env.AUDIO_PLAYER_TOKEN_SECRET) {
      throw new Error("Environment variable AUDIO_PLAYER_TOKEN_SECRET is required");
    }

    this.tokenSecret = env.AUDIO_PLAYER_TOKEN_SECRET;

    if (!env.AUDIO_PLAYER_ALLOWED_ORIGIN) {
      throw new Error("Environment variable AUDIO_PLAYER_ALLOWED_ORIGIN is required");
    }

    this.allowedOrigin = env.AUDIO_PLAYER_ALLOWED_ORIGIN;

    if (!env.AUDIO_PLAYER_DATABASE_URL) {
      throw new Error("Environment variable AUDIO_PLAYER_DATABASE_URL is required");
    }

    this.databaseUrl = env.AUDIO_PLAYER_DATABASE_URL;

    if (!env.AUDIO_PLAYER_DATABASE_CLIENT) {
      throw new Error("Environment variable AUDIO_PLAYER_DATABASE_CLIENT is required");
    }

    this.databaseClient = env.AUDIO_PLAYER_DATABASE_CLIENT;
  }
}
