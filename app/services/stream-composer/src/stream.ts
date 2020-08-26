import { Readable, PassThrough } from "stream"

export interface RepeatOptions {
  readonly repeatTimes?: number
}

export function repeat(
  provideReadable: () => Promise<Readable>,
  { repeatTimes = Infinity }: RepeatOptions = {},
): Readable {
  const output = new PassThrough()
  let currentInput: Readable
  let currentRepeat = 1

  output.on("error", err => {
    currentInput && currentInput.destroy(err)
  })

  output.on("close", () => {
    currentInput && currentInput.destroy()
  })

  const handleError = (err: Error): void => {
    output.destroy(err)
  }

  const getNext = (): void => {
    if (repeatTimes < currentRepeat) {
      output.end(null)
      return
    }

    currentRepeat += 1

    provideReadable().then((input: Readable): void => {
      currentInput = input

      currentInput.once("end", () => getNext()).pipe(output, { end: false })
    }, handleError)
  }

  getNext()

  return output
}
