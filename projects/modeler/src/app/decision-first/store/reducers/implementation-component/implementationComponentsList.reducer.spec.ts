import { blankPages } from 'core/models';
import * as fromActions from '../../actions/implementation-component/implementationComponentsList.action';
import * as fromImplementationComponentsList from './implementationComponentsList.reducer';

describe('Implementation Components List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromImplementationComponentsList;
      const action = {} as any;

      const state = fromImplementationComponentsList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromImplementationComponentsList;
      const action = new fromActions.LoadImplementationComponentsList();

      const state = fromImplementationComponentsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_IMPLEMENTATION_COMPONENTS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromImplementationComponentsList;
      const action = new fromActions.LoadSpecificPageForImplementationComponentsList('https://example.com/');

      const state = fromImplementationComponentsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.IMPLEMENTATION_COMPONENTS_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromImplementationComponentsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.ImplementationComponentsListFailure({} as any);

      const state = fromImplementationComponentsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_IMPLEMENTATION_COMPONENTS_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false and ids', () => {
      const { initialState } = fromImplementationComponentsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadImplementationComponentsListSuccess({
        pagination: blankPages,
        results: [{ id: 'implementationComponent1' } as any, { id: 'implementationComponent2' } as any],
      });

      const state = fromImplementationComponentsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['implementationComponent1', 'implementationComponent2']);
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromImplementationComponentsList;

      expect(fromImplementationComponentsList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
