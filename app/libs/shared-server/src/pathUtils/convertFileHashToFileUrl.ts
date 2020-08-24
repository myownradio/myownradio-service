import { extname } from "path"

const URL_PARTS_SEPARATOR = "/"

export function convertFileHashToFileUrl(hash: string, filename: string, baseUrl: string): string {
  const extension = extname(filename).toLowerCase()
  return `${[baseUrl, hash.slice(0, 1), hash.slice(1, 2), hash].join(URL_PARTS_SEPARATOR)}${extension}`
}
