import ConsoleLoggerService from "~/services/logger/impl/ConsoleLoggerService"

export interface LoggerService {
  info(message: string): void
  info(message: string, metadata: {}): void
  error(message: string): void
  error(message: string, metadata: {}): void
}

export function createLoggerService(): LoggerService {
  return new ConsoleLoggerService()
}
