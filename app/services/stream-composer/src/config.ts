export class Config {
  readonly httpServerPort: number
  readonly tokenSecret: string
  readonly radioManagerBackendUrl: string

  constructor(env: { [name: string]: string | undefined }) {
    if (!env.STREAM_COMPOSER_TOKEN_SECRET) {
      throw new Error("Environment variable STREAM_COMPOSER_TOKEN_SECRET is required")
    }

    this.tokenSecret = env.STREAM_COMPOSER_TOKEN_SECRET

    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080

    if (!env.STREAM_COMPOSER_RADIOMANAGER_BACKEND_URL) {
      throw new Error("Environment variable STREAM_COMPOSER_RADIOMANAGER_BACKEND_URL is required")
    }

    this.radioManagerBackendUrl = env.STREAM_COMPOSER_RADIOMANAGER_BACKEND_URL
  }
}
