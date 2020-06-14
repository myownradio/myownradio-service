import { createHmac } from "crypto"

/**
 * Creates hmac digest using sha256 algorithm.
 */
export function createHmacDigest(message: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(message)
    .digest("hex")
}
