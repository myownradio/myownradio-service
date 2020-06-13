import { join } from "path"

export function convertFileHashToFilePath(hash: string): string {
  return join(hash.slice(0, 1), hash.slice(1, 2), hash)
}
