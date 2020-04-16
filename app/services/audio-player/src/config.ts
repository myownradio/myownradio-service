export class Config {
  readonly httpServerPort: number;

  constructor(env: { [name: string]: string | undefined }) {
    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080;
  }
}
