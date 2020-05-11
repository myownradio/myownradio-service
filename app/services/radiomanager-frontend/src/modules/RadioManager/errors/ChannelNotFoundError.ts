export default class ChannelNotFoundError extends Error {
  constructor(...args: never[]) {
    super(...args)
    Object.setPrototypeOf(this, ChannelNotFoundError.prototype)
  }
}
