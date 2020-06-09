import { blankPages } from 'core/models';
import * as fromHomeSearchListActions from '../../actions/search/homeSearchList.actions';
import * as fromHomeSearchListReducer from './homeSearchList.reducer';

describe('HomeSearchList Reducer', () => {
  describe(`${fromHomeSearchListActions.LOAD_HOME_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromHomeSearchListReducer;
      const action = new fromHomeSearchListActions.LoadHomeSearchList();

      const state = fromHomeSearchListReducer.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromHomeSearchListActions.LOAD_HOME_SEARCH_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromHomeSearchListReducer;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromHomeSearchListActions.LoadHomeSearchListSuccess({
        pagination: blankPages,
        results: [{ id: 'search1' } as any, { id: 'search2' } as any],
      });

      const state = fromHomeSearchListReducer.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['search1', 'search2']);
    });
  });

  describe(`${fromHomeSearchListActions.UPDATE_SEARCH_FOR_HOME_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromHomeSearchListReducer;
      const action = new fromHomeSearchListActions.UpdateSearchForHomeSearchList({
        searchTerm: 'some string',
      });

      const state = fromHomeSearchListReducer.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toBe('some string');
    });
  });
});
