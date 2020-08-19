import * as E from "fp-ts/lib/Either"
import * as t from "io-ts"
import { PathReporter } from "io-ts/lib/PathReporter"
import { Context } from "koa"

class IOValidationError extends Error {
  constructor(message: string, readonly validations: t.Errors) {
    super(message)
  }
}

export const validationErrorMiddleware = async (ctx: Context, next: () => PromiseLike<any>): Promise<void> => {
  try {
    await next()
  } catch (error) {
    if (error instanceof IOValidationError) {
      ctx.status = 400
      ctx.body = error.validations
      return
    }

    throw error
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
