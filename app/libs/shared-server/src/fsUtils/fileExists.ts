import * as fs from "fs"

/**
 * Checks whether file exists.
 *
 * @param {string} path
 * @return {Promise<boolean>}
 */
export async function fileExists(path: string): Promise<boolean> {
  return fs.promises.access(path, fs.constants.F_OK).then(
    () => true,
    () => false,
  )
}
