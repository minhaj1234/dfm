import { omit } from 'ramda';

type NetworkActive = Record<string, boolean>;
export interface StateWithNetworkActive {
  networkActive: NetworkActive;
  genericNetworkActive: boolean;
}

export const networkActiveInitialState = {};

export function checkIfAnyAreTrue(arrayOfBools: boolean[]) {
  return arrayOfBools.some((bool) => bool);
}

export function createNetworkAdapter<T extends StateWithNetworkActive>() {
  return {
    makeOneActive(id: string, state: T): StateWithNetworkActive {
      return {
        genericNetworkActive: state.genericNetworkActive,
        networkActive: {
          ...state.networkActive,
          [id]: true,
        },
      };
    },

    makeOneInactive(id: string, state: T): StateWithNetworkActive {
      return {
        genericNetworkActive: state.genericNetworkActive,
        networkActive: omit([id], state.networkActive),
      };
    },

    makeGenericActive(state: T): StateWithNetworkActive {
      return {
        genericNetworkActive: true,
        networkActive: state.networkActive,
      };
    },

    makeGenericInactive(state: T): StateWithNetworkActive {
      return {
        genericNetworkActive: false,
        networkActive: state.networkActive,
      };
    },

    selectors: {
      selectNetworkActive(state: StateWithNetworkActive): Record<string, boolean> {
        return state.networkActive;
      },
      selectGenericNetworkActive(state: StateWithNetworkActive): boolean {
        return state.genericNetworkActive;
      },
      selectAnyNetworkActive(state: StateWithNetworkActive): boolean {
        return (
          state.genericNetworkActive ||
          checkIfAnyAreTrue(Reflect.ownKeys(state.networkActive).map((key: string) => state.networkActive[key]))
        );
      },
    },

    initialState: {
      genericNetworkActive: false,
      networkActive: {},
    } as StateWithNetworkActive,
  };
}
