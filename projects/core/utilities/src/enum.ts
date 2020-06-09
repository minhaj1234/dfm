export function getEnumValues(enumObject: Object): String[] {
  const keys = Object.keys(enumObject);
  return keys.map(item => Object(enumObject)[item]);
}