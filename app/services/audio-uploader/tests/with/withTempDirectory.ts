import fs = require("fs")
import os = require("os")

export function withTempDirectory(): string {
  const tempDirectory = `${os.tmpdir()}/${Date.now()}-${Math.random()}}`

  beforeAll(async () => {
    await fs.promises.mkdir(tempDirectory, { recursive: true })
  })

  afterAll(async () => {
    await fs.promises.rmdir(tempDirectory, { recursive: true })
  })

  return tempDirectory
}
