import { blankPages } from 'core/models';
import { Search } from '../../../models/search.model';
import * as autocompleteSearchListActions from './autocompleteSearchList.actions';

describe('Autocomplete Search List Actions', () => {
  describe('Load Autocomplete Search List Success', () => {
    it('should create an action', () => {
      const search1: Search = {} as any;
      const search2: Search = {} as any;
      const payload = { results: [search1, search2], pagination: blankPages };
      const action = new autocompleteSearchListActions.LoadAutocompleteSearchListSuccess(payload);
      expect({ ...action }).toEqual({
        payload,
        type: autocompleteSearchListActions.LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS,
      });
    });
  });

  describe('Update Search For Autocomplete Search List', () => {
    it('should create an action', () => {
      const action = new autocompleteSearchListActions.UpdateSearchForAutocompleteSearchList({
        searchTerm: 'string for test',
      });
      expect({ ...action }).toEqual({
        payload: {
          searchTerm: 'string for test',
        },
        type: autocompleteSearchListActions.UPDATE_SEARCH_FOR_AUTOCOMPLETE_SEARCH_LIST,
      });
    });
  });

  describe('Get Autocomplete Search List Initial State', () => {
    it('should create an action', () => {
      const action = new autocompleteSearchListActions.SetAutocompleteSearchListInitialState();
      expect({ ...action }).toEqual({
        type: autocompleteSearchListActions.SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE,
      });
    });
  });

  describe('Autocomplete Search List Failure', () => {
    it('should create an action', () => {
      const action = new autocompleteSearchListActions.AutocompleteSearchListFailure(new Error('error message for test'));
      expect({ ...action }).toEqual({
        payload: new Error('error message for test'),
        type: autocompleteSearchListActions.AUTOCOMPLETE_SEARCH_LIST_FAILURE,
      });
    });
  });
});
