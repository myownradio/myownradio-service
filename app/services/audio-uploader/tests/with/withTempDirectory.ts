import fs = require("fs")
import os = require("os")

export function withTempDirectory(): { current: string } {
  const tempDirectory = { current: null }

  beforeAll(async () => {
    tempDirectory.current = `${os.tmpdir()}/${Date.now()}-${Math.random()}}`
    await fs.promises.mkdir(tempDirectory.current, { recursive: true })
  })

  afterAll(async () => {
    if (tempDirectory.current) {
      await fs.promises.rmdir(tempDirectory.current, { recursive: true })
    }
  })

  return tempDirectory
}
