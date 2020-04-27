import { createHmac } from "crypto"

/**
 * Creates hmac digest using sha256 algorithm.
 */
function createHmacDigest(message: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(message)
    .digest("hex")
}

/**
 * Validates signature of provided message and checks that it's not expired.
 */
export function verifySignature(message: string, signature: string, secret: string, ttl: number): boolean {
  const decodedSignature = Buffer.from(signature, "base64").toString()
  const [extractedSignedAt, extractedHmacDigest] = decodedSignature.split(".", 2)
  const payload = `${extractedSignedAt}.${message}`
  const hmacDigest = createHmacDigest(payload, secret)

  if (extractedHmacDigest !== hmacDigest) {
    return false
  }

  const signedAt = parseInt(extractedSignedAt, 10)

  if (isNaN(signedAt)) {
    return false
  }

  return Date.now() < signedAt + ttl
}

/**
 * Generates signature for provided message.
 */
export function createSignature(message: string, secret: string): string {
  const signedAt = Date.now()
  const payload = `${signedAt}.${message}`
  const hmacDigest = createHmacDigest(payload, secret)
  return Buffer.from(`${signedAt}.${hmacDigest}`).toString("base64")
}
