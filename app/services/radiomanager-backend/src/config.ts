export class Config {
  readonly httpServerPort: number;
  readonly tokenSecret: string;
  readonly metadataSecret: string;
  readonly databaseUrl: string;
  readonly databaseClient: string;
  readonly metadataSignatureTtl: number;
  readonly allowedOrigin: string;

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

    if (!env.RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL) {
      throw new Error("Environment variable RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL is required");
    }

    // Used parseFloat instead of parseInt to correctly parse Infinity value
    this.metadataSignatureTtl = parseFloat(env.RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL);

    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080;

    if (!env.RADIOMANAGER_BACKEND_ALLOWED_ORIGIN) {
      throw new Error("Environment variable RADIOMANAGER_BACKEND_ALLOWED_ORIGIN is required");
    }

    this.allowedOrigin = env.RADIOMANAGER_BACKEND_ALLOWED_ORIGIN;
  }
}
