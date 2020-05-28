import { join } from "path"

const URL_PARTS_SEPARATOR = "/"

export function convertFileHashToFilePath(hash: string): string {
  return join(hash.slice(0, 1), hash.slice(1, 2), hash)
}

export function convertFileHashToFileUrl(hash: string, baseUrl: string): string {
  return [baseUrl, hash.slice(0, 1), hash.slice(1, 2), hash].join(URL_PARTS_SEPARATOR)
}
