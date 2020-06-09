export function convertStringToDate(date: string): Date {
  return date ? new Date(date) : null;
}
