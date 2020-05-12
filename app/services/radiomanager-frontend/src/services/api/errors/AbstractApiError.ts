export default abstract class AbstractApiError extends Error {
  protected constructor(readonly status: number, readonly metadata?: unknown) {
    super(`Server responded with error status.`)
  }
}
