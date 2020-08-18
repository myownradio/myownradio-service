import { createHmac } from "crypto"
import * as E from "fp-ts/lib/Either"
import * as t from "io-ts"
import { PathReporter } from "io-ts/lib/PathReporter"

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

class IOValidationError extends TypeError {
  constructor(message: string, readonly validations: t.Errors) {
    super(message)
  }
}

export const tryCatch = <F extends (...args: any) => any, E extends any>(
  fn: F,
  onError: (reason: unknown) => E,
): E | ReturnType<F> => {
  try {
    return fn()
  } catch (error) {
    return onError(error)
  }
}

export const ioValidationsToError = (validations: t.Errors): Error =>
  new IOValidationError(
    tryCatch(
      () => JSON.stringify(PathReporter.report(E.left(validations)), null, 2),
      () => "Failed to generate report",
    ),
    validations,
  )

/**
 * Makes decoder that throws IOValidationError if decode fails
 */
export const decodeT = <I, A>(type: t.Decoder<I, A>) => (x: I): A => {
  const decodeResult = type.decode(x)
  if (decodeResult._tag === "Left") {
    throw ioValidationsToError(decodeResult.left)
  }
  return decodeResult.right
}
