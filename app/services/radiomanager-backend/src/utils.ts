import { createHmac } from "crypto"

/**
 * Creates hmac digest using sha256 algorithm.
 * todo? move to shared library
 */
function createHmacDigest(data: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(data)
    .digest("hex")
}

/**
 * Validates that signature of provided metadata is correct and is not expired.
 * todo? move to shared library
 */
export function verifyMetadataSignature(rawMetadata: string, signature: string, secret: string, ttl: number): boolean {
  const decodedSignature = Buffer.from(signature, "base64").toString()
  const [extractedSignedAt, extractedHmacDigest] = decodedSignature.split(".", 2)
  const payload = `${extractedSignedAt}.${rawMetadata}`
  const hmacDigest = createHmacDigest(payload, secret)

  if (extractedHmacDigest !== hmacDigest) {
    return false
  }

  return Date.now() < +extractedSignedAt + ttl
}
