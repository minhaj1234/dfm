import { getPreventDuplicateNameMessage } from "./getPreventDuplicateNameMessage";

describe('getPreventDuplicateNameMessage', () => {
  it('should return string array', () => {
    const result = getPreventDuplicateNameMessage('new name');

    expect(result).toEqual(['resources.nameChangedTo', ` 'new name' `, 'resources.toAvoidDuplication']);
  });
});
