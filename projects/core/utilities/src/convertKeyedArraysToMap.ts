export function convertKeyedArraysToMap<T extends { key: string }>(graphables: T[]): Record<string, T> {
  return graphables.reduce((map, graphable) => {
    map[graphable.key] = graphable;
    return map;
  }, {});
}
