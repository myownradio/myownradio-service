export function nop(): void {
  return
}

export function notImplemented(): void {
  throw new Error("Not implemented")
}

export async function notImplementedAsync(): Promise<void> {
  throw new Error("Not implemented")
}
