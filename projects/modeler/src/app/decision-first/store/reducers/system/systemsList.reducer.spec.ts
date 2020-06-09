import { blankPages } from 'core/models';
import * as fromActions from '../../actions/system/systemsList.action';
import * as fromSystemsList from './systemsList.reducer';

describe('System List Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromSystemsList;
      const action = {} as any;

      const state = fromSystemsList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromActions.LOAD_SYSTEMS_LIST} action`, () => {
    it('should have networkLoading be true', () => {
      const { initialState } = fromSystemsList;
      const action = new fromActions.LoadSystemsList();

      const state = fromSystemsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_SPECIFIC_PAGE_FOR_SYSTEMS_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromSystemsList;
      const action = new fromActions.LoadSpecificPageForSystemsList('https://example.com/3453654');

      const state = fromSystemsList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.SYSTEMS_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromSystemsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.SystemsListFailure({} as any);

      const state = fromSystemsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.LOAD_SYSTEMS_LIST_SUCCESS} action`, () => {
    it('should return loaded system list', () => {
      const { initialState } = fromSystemsList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadSystemsListSuccess({
        pagination: blankPages,
        results: [{ id: 'system1' } as any, { id: 'system2' } as any],
      });

      const state = fromSystemsList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['system1', 'system2']);
    });
  });

  describe('getPagination', () => {
    it('returns the pagination', () => {
      const { initialState } = fromSystemsList;

      expect(fromSystemsList.getPagination(initialState)).toEqual({
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      });
    });
  });
});
