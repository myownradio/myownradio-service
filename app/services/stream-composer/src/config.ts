export class Config {
  readonly httpServerPort: number;
  readonly tokenSecret: string;

  constructor(env: { [name: string]: string | undefined }) {
    if (!env.SCHEDULER_TOKEN_SECRET) {
      throw new Error("Environment variable SCHEDULER_TOKEN_SECRET is required");
    }

    this.tokenSecret = env.SCHEDULER_TOKEN_SECRET;

    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080;
  }
}
