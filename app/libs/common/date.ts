export function toMillis(date: string | number | Date): number {
  return new Date(date).getTime()
}

export function toIso(date: string | number | Date): string {
  return new Date(date).toISOString()
}
