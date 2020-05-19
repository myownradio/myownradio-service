export class Config {
  readonly httpServerPort: number
  readonly tokenSecret: string
  readonly allowedOrigin: string
  readonly databaseUrl: string
  readonly databaseClient: string
  readonly amqpQueueUrl: string

  constructor(env: { [name: string]: string | undefined }) {
    if (!env.SCHEDULER_TOKEN_SECRET) {
      throw new Error("Environment variable SCHEDULER_TOKEN_SECRET is required")
    }

    this.tokenSecret = env.SCHEDULER_TOKEN_SECRET

    this.httpServerPort = env.PORT ? parseInt(env.PORT, 10) : 8080

    if (!env.SCHEDULER_ALLOWED_ORIGIN) {
      throw new Error("Environment variable SCHEDULER_ALLOWED_ORIGIN is required")
    }

    this.allowedOrigin = env.SCHEDULER_ALLOWED_ORIGIN

    if (!env.SCHEDULER_DATABASE_URL) {
      throw new Error("Environment variable SCHEDULER_DATABASE_URL is required")
    }

    this.databaseUrl = env.SCHEDULER_DATABASE_URL

    if (!env.SCHEDULER_DATABASE_CLIENT) {
      throw new Error("Environment variable SCHEDULER_DATABASE_CLIENT is required")
    }

    this.databaseClient = env.SCHEDULER_DATABASE_CLIENT

    if (!env.SCHEDULER_AMQP_QUEUE_URL) {
      throw new Error("Environment variable SCHEDULER_AMQP_QUEUE_URL is required")
    }

    this.amqpQueueUrl = env.SCHEDULER_AMQP_QUEUE_URL
  }
}
