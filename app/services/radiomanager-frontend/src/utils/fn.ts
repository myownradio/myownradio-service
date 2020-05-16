export function nop(): void {
  return
}

export function notImplemented(): void {
  throw new Error("Not implemented")
}

export async function notImplementedAsync(): Promise<void> {
  throw new Error("Not implemented")
}

export function isEmptyObject(object: object): boolean {
  return Object.keys(object).length === 0
}
