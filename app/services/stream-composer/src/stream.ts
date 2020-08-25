import { Readable, PassThrough } from "stream"

export function repeat(provideReadable: () => Promise<Readable>): Readable {
  const output = new PassThrough()
  let currentInput: Readable

  output.on("error", err => {
    currentInput && currentInput.destroy(err)
  })

  const handleError = (err: Error): void => {
    output.destroy(err)
  }

  const getNext = (): void => {
    provideReadable().then((input: Readable): void => {
      currentInput = input

      currentInput.once("end", () => getNext()).pipe(output, { end: false })
    }, handleError)
  }

  getNext()

  return output
}
