import { LoggerService } from "../LoggerService";

export default class ConsoleLoggerService implements LoggerService {
  error(message: string, metadata?: {}): void {
    console.error(message, metadata);
  }

  info(message: string, metadata?: {}): void {
    console.info(message, metadata);
  }
}
