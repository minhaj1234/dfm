import { blankPages } from 'core/models';
import * as fromAutocompleteSearchListActions from '../../actions/search/autocompleteSearchList.actions';
import * as fromAutocompleteSearchList from './autocompleteSearchList.reducer';

describe('AutocompleteSearchList Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromAutocompleteSearchList;
      const action = {} as any;

      const state = fromAutocompleteSearchList.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe(`${fromAutocompleteSearchListActions.LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS} action`, () => {
    it('should have correct load autocomplete search list', () => {
      const { initialState } = fromAutocompleteSearchList;
      const stateWithNetworkActive = { ...initialState, genericNetworkActive: true };
      const action = new fromAutocompleteSearchListActions.LoadAutocompleteSearchListSuccess({
        pagination: blankPages,
        results: [{ id: 'search1' } as any, { id: 'search2' } as any],
      });

      const state = fromAutocompleteSearchList.reducer(stateWithNetworkActive, action);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['search1', 'search2']);
    });
  });

  describe(`${fromAutocompleteSearchListActions.UPDATE_SEARCH_FOR_AUTOCOMPLETE_SEARCH_LIST} action`, () => {
    it('should update autocomplete search list', () => {
      const { initialState } = fromAutocompleteSearchList;
      const action = new fromAutocompleteSearchListActions.UpdateSearchForAutocompleteSearchList({
        searchTerm: 'some string',
      });

      const state = fromAutocompleteSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
      expect(state.searchTerm).toBe('some string');
    });
  });

  describe(`${fromAutocompleteSearchListActions.SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE} action`, () => {
    it('should get initial state', () => {
      const { initialState } = fromAutocompleteSearchList;

      const loadAutocompleteSearchListSuccessAction = new fromAutocompleteSearchListActions.LoadAutocompleteSearchListSuccess({
        pagination: blankPages,
        results: [{ id: 'search1' } as any, { id: 'search2' } as any],
      });

      let state = fromAutocompleteSearchList.reducer(initialState, loadAutocompleteSearchListSuccessAction);

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['search1', 'search2']);

      const setAutocompleteSearchListInitialStateAction = 
        new fromAutocompleteSearchListActions.SetAutocompleteSearchListInitialState();

      state = fromAutocompleteSearchList.reducer(state, setAutocompleteSearchListInitialStateAction);

      expect(state.ids).toEqual([]);
    });
  });
});
