import { getUrlWithoutProtocol } from "./getrUrlWithoutProtocol";

describe('setFormAvailability', () => {
  it('should return url without http', () => {
    const result = getUrlWithoutProtocol('http://dfm.com');

    expect(result).toEqual('dfm.com');
  });

  it('should return url without https', () => {
    const result = getUrlWithoutProtocol('https://dfm.com');

    expect(result).toEqual('dfm.com');
  });
});
