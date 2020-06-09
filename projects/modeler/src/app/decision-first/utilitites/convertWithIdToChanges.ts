export function convertWithIdToChanges<T extends { id: string }>(element: T) {
  return {
    changes: element,
    id: element.id,
  };
}
