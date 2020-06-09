import { Config } from '.';
import { devConfig } from './devConfig.map';
import * as fromGetWindow from './getWindow';
import { localConfig } from './localConfig.map';
import { prodConfig } from './prodConfig.map';
import { demoConfig } from './demoConfig.map';

describe('Config', () => {
  function useProd() {
    const result = {
      location: {
        hostname: 'modeler2.decisionsfirst.com'
      }
    } as any;

    spyOn(fromGetWindow, 'getWindow').and.returnValue(result);
  }

  function useDemo() {
    const result = {
      location: {
        hostname: 'demo.modeler2.decisionsfirst.com'
      }
    } as any;

    spyOn(fromGetWindow, 'getWindow').and.returnValue(result);
  }

  function useDev() {
    const result = {
      location: {
        hostname: 'modeler2.decisionsfirst.com'
      }
    } as any;

    spyOn(fromGetWindow, 'getWindow').and.returnValue(result);
  }

  describe('proxyUri', () => {
    it('returns the correct proxyUri for prod', () => {
      useProd();
      expect(Config.proxyUri).toEqual(prodConfig.proxyUri);
    });

    it('returns the correct proxyUri for dev', () => {
      useDev();
      expect(Config.proxyUri).toEqual(devConfig.proxyUri);
    });

    it('returns the correct proxyUri for demo', () => {
      useDemo();
      expect(Config.proxyUri).toEqual(demoConfig.proxyUri);
    });

    it('returns the correct proxyUri for local', () => {
      expect(Config.proxyUri).toEqual(localConfig.proxyUri);
    });
  });

  describe('rootUri', () => {
    it('returns the correct rootUri for prod', () => {
      useProd();
      expect(Config.rootUri).toEqual(prodConfig.rootUri);
    });

    it('returns the correct rootUri for dev', () => {
      useDev();
      expect(Config.rootUri).toEqual(devConfig.rootUri);
    });

    it('returns the correct rootUri for demo', () => {
      useDemo();
      expect(Config.rootUri).toEqual(demoConfig.rootUri);
    });

    it('returns the correct rootUri for local', () => {
      expect(Config.rootUri).toEqual(localConfig.rootUri);
    });
  });
});
