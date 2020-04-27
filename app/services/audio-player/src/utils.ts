import * as path from "path"

/**
 * Converts hash to path with sub directories.
 *
 * @param {string} hash
 * @return {string}
 */
export function hashToPath(hash: string): string {
  const parts = [hash.slice(0, 1), hash.slice(1, 2), hash]
  return parts.join(path.sep)
}
