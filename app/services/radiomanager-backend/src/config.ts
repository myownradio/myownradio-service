export class Config {
  readonly httpServerPort: number;
  readonly tokenSecret: string;
  readonly metadataSecret: string;
  readonly databaseUrl: string;
  readonly databaseClient: string;

  constructor(env: { [name: string]: string | undefined }) {
    if (!env.RADIOMANAGER_BACKEND_TOKEN_SECRET) {
      throw new Error("Environment variable RADIOMANAGER_BACKEND_TOKEN_SECRET is required");
    }

    this.tokenSecret = env.RADIOMANAGER_BACKEND_TOKEN_SECRET;

    if (!env.RADIOMANAGER_BACKEND_METADATA_SECRET) {
      throw new Error("Environment variable RADIOMANAGER_BACKEND_METADATA_SECRET is required");
    }

    this.metadataSecret = env.RADIOMANAGER_BACKEND_METADATA_SECRET;

    if (!env.RADIOMANAGER_BACKEND_DATABASE_URL) {
      throw new Error("Environment variable RADIOMANAGER_BACKEND_DATABASE_URL is required");
    }

    this.databaseUrl = env.RADIOMANAGER_BACKEND_DATABASE_URL;

    if (!env.RADIOMANAGER_BACKEND_DATABASE_CLIENT) {
      throw new Error("Environment variable RADIOMANAGER_BACKEND_DATABASE_CLIENT is required");
    }

    this.databaseClient = env.RADIOMANAGER_BACKEND_DATABASE_CLIENT;

    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080;
  }
}
