import { merge, toPairs, update } from 'ramda';

function getLocationOfChildInParent<T extends { id: string }, U extends Record<string, T[]>, K extends keyof U>(
  possibleChild: T,
  parent: U,
  arrayKey: K,
): number {
  return parent[arrayKey].findIndex((element) => element.id === possibleChild.id);
}

function clone<T extends Record<string, any>>(record: T): T {
  const newRecord: any = {} as T;
  toPairs(record).forEach(([key, value]: [string, any]) => {
    newRecord[key] = value;
  });
  return newRecord;
}

export function getNewEntitiesIfNeeded<T extends { id: string }, U extends Record<string, any>>(
  child: T,
  parentRecord: U,
  keys: string[],
): U {
  const result = {};

  keys.forEach((key: string) => {
    toPairs(parentRecord)
      .forEach(([id, parent]: [string, U]) => {
        if (isKeyArrayAndHasChild(child, parent, key)) {
          result[id] = cloneParentWithUpdateChildForArray(child, parentRecord[id], key);
        } else if (isKeySingleObjectAndNeedUpdate(child, parent, key)) {
          result[id] = clone(parentRecord[id])
          result[id][key] = child;
        }
      });
  });

  return merge(parentRecord, result);
}

function isKeyArrayAndHasChild<T extends { id: string }>(child: T, parent: Record<string, any>, key: string): boolean {
  return !!parent[key] && Array.isArray(parent[key]) && getLocationOfChildInParent(child, parent, key) !== -1;
}

function isKeySingleObjectAndNeedUpdate<T extends { id: string }>(child: T, parent: Record<string, any>, key: string): boolean {
  return !!parent[key] && !Array.isArray(parent[key]) && parent[key].id === child.id;
}

function cloneParentWithUpdateChildForArray<T extends { id: string }>(child: T, parent: Record<string, any>, key: string): Record<string, any> {
  const index = getLocationOfChildInParent(child, parent, key);
  const newParent = clone(parent);
  newParent[key] = update(index, child, parent[key]);
  return newParent;
}
