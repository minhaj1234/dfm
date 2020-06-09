import * as SockJS from 'sockjs-client';
import { stompBaseConfig } from './stomp-base-config';

describe('StompBaseConfig', () => {
  it('returns a SockJs object when passed a url', () => {
    const config = stompBaseConfig('http://localhost', 'dev');
    const sockJs = (config.url as () => any)();
    expect(sockJs).toEqual(jasmine.any(SockJS));
  });

  it('has the correct url in the SockJS Object', () => {
    const config = stompBaseConfig('http://localhost', 'dev');
    const sockJs = (config.url as () => any)();
    expect(sockJs.url).toEqual('http://localhost');
  });
});