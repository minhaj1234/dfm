export function getPreventDuplicateNameMessage(name: string): string[] {
  return ['resources.nameChangedTo', ` '${name}' `, 'resources.toAvoidDuplication'];
}
