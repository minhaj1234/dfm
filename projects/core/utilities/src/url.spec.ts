import { getUrlWithProtocol, isCorrectUrl } from './url';

describe('url utilities', () => {
  describe('getUrlWithProtocol', () => {
    it('should add protocol', () => {
      expect(getUrlWithProtocol('example.com')).toEqual('http://example.com');
    });

    it('should not change value', () => {
      expect(getUrlWithProtocol('https://example.com')).toEqual('https://example.com');
    });
  });

  describe('isCorrectUrl', () => {
    it('should return true', () => {
      expect(isCorrectUrl('https://example.com/first-parameter/second-parameter/')).toBeTruthy();
    });

    it('should return false', () => {
      expect(isCorrectUrl('http://')).toBeFalsy();
    });
  });
});