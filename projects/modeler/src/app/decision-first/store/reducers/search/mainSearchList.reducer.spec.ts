import { blankPages } from 'core/models';
import * as fromActions from '../../actions/search/mainSearchList.actions';
import * as fromSearchList from './mainSearchList.reducer';

describe('MainSearchList Reducer', () => {
  describe(`${fromActions.LOAD_MAIN_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromSearchList;
      const action = new fromActions.LoadMainSearchList();

      const state = fromSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_MAIN_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromSearchList;
      const action = new fromActions.LoadMainSearchList();

      const state = fromSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_MAIN_SEARCH_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromSearchList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromActions.LoadMainSearchListSuccess({
        pagination: blankPages,
        results: [{ id: 'search1' } as any, { id: 'search2' } as any],
      });

      const state = fromSearchList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['search1', 'search2']);
    });
  });

  describe(`${fromActions.UPDATE_SEARCH_FOR_MAIN_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromSearchList;
      const action = new fromActions.UpdateSearchForMainSearchList({
        searchTerm: 'some string',
      });

      const state = fromSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toBe('some string');
    });
  });
});
