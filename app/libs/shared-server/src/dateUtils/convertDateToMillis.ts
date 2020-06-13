export function convertDateToMillis(date: string | number | Date): number {
  return new Date(date).getTime()
}
