import { last } from 'ramda';

interface IGroupedDiffs {
  N?: deepDiff.IDiff[];
  D?: deepDiff.IDiff[];
  E?: deepDiff.IDiff[];
  A?: deepDiff.IDiff[];
}

export enum DiffKinds {
  PropertyOrElementAdded = 'N',
  PropertyOrElementDeleted = 'D',
  PropertyOrElementEdit = 'E',
  ArrayChanged = 'A',
}

export function groupDiffs(diffs: deepDiff.IDiff[] = [], toOmitFromCompare: Record<string, boolean>): IGroupedDiffs {
  return diffs.reduce((map, dif) => {
    if (!toOmitFromCompare[last(dif.path)]) {
      map[dif.kind] ? map[dif.kind].push(dif) : (map[dif.kind] = [dif]);
    }
    return map;
  }, {});
}
