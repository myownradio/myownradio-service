import { createHmacDigest } from "./createHmacDigest"

/**
 * Generates signature for provided message.
 */

export function createSignature(message: string, secret: string): string {
  const signedAt = Date.now()
  const payload = `${signedAt}.${message}`
  const hmacDigest = createHmacDigest(payload, secret)
  return Buffer.from(`${signedAt}.${hmacDigest}`).toString("base64")
}
