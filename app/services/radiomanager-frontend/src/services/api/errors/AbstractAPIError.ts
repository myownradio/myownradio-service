export abstract class AbstractAPIError extends Error {
  protected constructor(readonly status: number, readonly metadata?: unknown) {
    super(`Server responded with error status`)
  }
}
