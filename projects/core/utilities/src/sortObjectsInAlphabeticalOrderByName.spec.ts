import { sortObjectsInAlphabeticalOrderByName } from "./sortObjectsInAlphabeticalOrderByName";

describe('sortObjectsInAlphabeticalOrderByName', () => {
  it('should return array in alphabetical order by name', () => {
    expect(sortObjectsInAlphabeticalOrderByName([{name: 'b'}, {name: 'c'}, {name: 'a'}])).toEqual([{name: 'a'}, {name: 'b'}, {name: 'c'}]);
  });
});
