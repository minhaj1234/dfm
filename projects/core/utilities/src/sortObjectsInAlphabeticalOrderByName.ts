export function sortObjectsInAlphabeticalOrderByName<T extends {name: string}>(objects: T[]): T[] {
  return objects.sort(comparatorObjectsInAlphabeticalOrderByName);
}

function comparatorObjectsInAlphabeticalOrderByName<T extends {name: string}>(firstItem: T, secondItem: T): number {
  const firstItemUpperCase = firstItem.name.toUpperCase();
  const secondItemUpperCase = secondItem.name.toUpperCase();

  return (firstItemUpperCase < secondItemUpperCase) ? -1 : (firstItemUpperCase > secondItemUpperCase) ? 1 : 0;
}
