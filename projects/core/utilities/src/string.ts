export function getI18nString(value: string): string {
  return `resources.${value}`;
}

export function convertStringToI18nString(value: string): string {
  return getI18nString(value.charAt(0).toLowerCase() + value.slice(1));
}
