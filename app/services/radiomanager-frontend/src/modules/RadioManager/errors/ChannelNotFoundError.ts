export default class ChannelNotFoundError extends Error {
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, ChannelNotFoundError.prototype)
  }
}
