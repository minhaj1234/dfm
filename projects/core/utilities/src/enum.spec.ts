import { getEnumValues } from "./enum";

describe('enum utilities', () => {
  it('getEnumValues', () => {
    enum testEnum {
      firstValue = 'FIRST VALUE',
      secondValue = 'second value',
    }

    expect(getEnumValues(testEnum)).toEqual(['FIRST VALUE', 'second value']);
  });
});