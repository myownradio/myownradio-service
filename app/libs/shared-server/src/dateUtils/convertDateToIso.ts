export function convertDateToIso(date: string | number | Date): string {
  return new Date(date).toISOString()
}
