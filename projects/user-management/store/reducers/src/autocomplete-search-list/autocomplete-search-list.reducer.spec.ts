import { AutocompleteListItem } from 'core/models';
import * as fromActions from 'user-management/store/actions';
import * as fromAutocompleteSearchList from './autocomplete-search-list.reducer';

describe('Autocomplete Search List Reducer', () => {
  describe(`${fromActions.LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromAutocompleteSearchList;
      const action = new fromActions.LoadGroupsToAutocompleteSearchList({
        accountId: 'account1',
        searchTerm: '',
        pageNumber: 1,
        pageSize: 1,
      });

      const state = fromAutocompleteSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST} action`, () => {
    it('should have genericNetworkActive be true', () => {
      const { initialState } = fromAutocompleteSearchList;
      const action = new fromActions.LoadUsersToAutocompleteSearchList({
        accountId: 'account1',
        searchTerm: '',
        pageNumber: 1,
        pageSize: 1,
      });

      const state = fromAutocompleteSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(true);
    });
  });

  describe(`${fromActions.LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromAutocompleteSearchList;
      const action = new fromActions.LoadAutocompleteSearchListSuccess({
        results: [
          {id: 'id1'} as AutocompleteListItem,
          {id: 'id2'} as AutocompleteListItem,
        ]
      });

      const state = fromAutocompleteSearchList.reducer(initialState, action);

      expect(state.ids).toEqual(['id1', 'id2']);
      expect(state.genericNetworkActive).toBe(false);
    });
  });

  describe(`${fromActions.SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromAutocompleteSearchList;
      const loadAutocompleteSearchListSuccessAction = new fromActions.LoadAutocompleteSearchListSuccess({
        results: [{ id: 'id1' } as AutocompleteListItem, { id: 'id2' } as AutocompleteListItem],
      });
      let state = fromAutocompleteSearchList.reducer(initialState, loadAutocompleteSearchListSuccessAction);
      const action = new fromActions.SetAutocompleteSearchListInitialState();

      expect(state.genericNetworkActive).toBe(false);
      expect(state.ids).toEqual(['id1', 'id2']);

      state = fromAutocompleteSearchList.reducer(initialState, action);

      expect(state.ids).toEqual([]);
    });
  });

  describe(`${fromActions.USER_MANAGEMENT_AUTOCOMPLETE_SEARCH_LIST_FAILURE} action`, () => {
    it('should have genericNetworkActive be false', () => {
      const { initialState } = fromAutocompleteSearchList;
      const action = new fromActions.AutocompleteSearchListFailure(new Error('message'));

      const state = fromAutocompleteSearchList.reducer(initialState, action);

      expect(state.genericNetworkActive).toBe(false);
    });
  });
});