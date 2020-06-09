import { createNetworkAdapter, StateWithNetworkActive } from './networkActive';

describe('networkActive helper', () => {
  const networkAdapater = createNetworkAdapter();

  function createState(genericNetworkActive = false): StateWithNetworkActive {
    return {
      genericNetworkActive,
      networkActive: {
        def: true,
      },
    };
  }

  it('can make one active', () => {
    const initialState = createState();

    const state = networkAdapater.makeOneActive('abc', initialState);

    expect(state.networkActive.abc).toBe(true);
  });

  it('can make one inactive', () => {
    const initialState = createState();

    const state = networkAdapater.makeOneInactive('def', initialState);

    expect(state.networkActive.def).toBeUndefined();
  });

  it('can make the generic network active', () => {
    const initialState = createState();

    const state = networkAdapater.makeGenericActive(initialState);

    expect(state.genericNetworkActive).toBe(true);
  });

  it('can make the generic network inactive', () => {
    const initialState = createState(true);

    const state = networkAdapater.makeGenericInactive(initialState);

    expect(state.genericNetworkActive).toBe(false);
  });

  describe('selectors', () => {
    it('selectNetworkActive get the networkActive record', () => {
      expect(networkAdapater.selectors.selectNetworkActive(createState())).toEqual({ def: true });
    });

    it('selectGenericNetworkActive get the networkActive record', () => {
      expect(networkAdapater.selectors.selectGenericNetworkActive(createState())).toEqual(false);
    });

    describe('selectAnyNetworkActive', () => {
      it('returns true if the genericNetwork is active', () => {
        expect(
          networkAdapater.selectors.selectAnyNetworkActive({ genericNetworkActive: true, networkActive: {} }),
        ).toBe(true);
      });

      it('returns true if the any specific networks are active', () => {
        expect(
          networkAdapater.selectors.selectAnyNetworkActive({
            genericNetworkActive: false,
            networkActive: { abc: true },
          }),
        ).toBe(true);
      });

      it('returns false if there is no network activity', () => {
        expect(
          networkAdapater.selectors.selectAnyNetworkActive({
            genericNetworkActive: false,
            networkActive: {},
          }),
        ).toBe(false);
      });
    });
  });
});
