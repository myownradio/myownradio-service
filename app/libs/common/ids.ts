import Hashids from "hashids"

const SALT = "8OnD2szBqKoo5sET6P2M"

const hashIds = new Hashids(SALT, 6)

export function encodeId(id: number): string {
  return hashIds.encode(id)
}

export function decodeId(encodedId: string): number | null {
  const probablyNumber = Number(hashIds.decode(encodedId)[0])
  return isNaN(probablyNumber) ? null : probablyNumber
}
