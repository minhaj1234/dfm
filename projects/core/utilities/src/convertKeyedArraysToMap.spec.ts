import { convertKeyedArraysToMap } from './convertKeyedArraysToMap';

describe('ConvertKeyedArraysToMap', () => {
  it('returns a Map with keys as string', () => {
    const graphable1 = {
      key: 'graphable1',
    };
    const graphable2 = {
      key: 'graphable2',
    };
    expect(convertKeyedArraysToMap([graphable1, graphable2])).toEqual({
      graphable1,
      graphable2,
    });
  });
});
