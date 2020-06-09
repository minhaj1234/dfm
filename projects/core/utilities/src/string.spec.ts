import { convertStringToI18nString, getI18nString } from "./string";

describe('string utilities', () => {
  it('getI18nString', () => {
    expect(getI18nString('forTest')).toEqual('resources.forTest');
  });

  it('convertStringToI18nString', () => {
    expect(convertStringToI18nString('Decision')).toEqual('resources.decision');
  });
});
