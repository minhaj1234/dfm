import { AutocompleteListItem } from 'core/models';
import * as autocompleteSearchListActions from './autocomplete-search-list.actions';

describe('Autocomplete Search List Actions', () => {
    describe('Load Groups To Autocomplete Search List', () => {
        it('should create an action', () => {
            const payload = { 
                accountId: 'id',
                searchTerm: 'searchTerm',
                pageNumber: 1,
                pageSize: 10,
              };
        
              const action = new autocompleteSearchListActions.LoadGroupsToAutocompleteSearchList(payload);
        
              expect({ ...action }).toEqual({
                payload,
                type: autocompleteSearchListActions.LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST,
              });
        });
    });

    describe('Load Users To Autocomplete Search List', () => {
        it('should create an action', () => {
            const payload = { 
                accountId: 'id',
                searchTerm: 'searchTerm',
                pageNumber: 1,
                pageSize: 10,
              };
        
              const action = new autocompleteSearchListActions.LoadUsersToAutocompleteSearchList(payload);
        
              expect({ ...action }).toEqual({
                payload,
                type: autocompleteSearchListActions.LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST,
              });
        });
    });
    
    describe('Load Users To Autocomplete Search List', () => {
        it('should create an action', () => {
            const payload = { 
                results: [{ id: '1', name: 'name' } as AutocompleteListItem],
              };
        
              const action = new autocompleteSearchListActions.LoadAutocompleteSearchListSuccess(payload);
        
              expect({ ...action }).toEqual({
                payload,
                type: autocompleteSearchListActions.LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS,
              });
        });
    });

    describe('Set Autocomplete Search List Initial State', () => {
        it('should create an action', () => {
              const action = new autocompleteSearchListActions.SetAutocompleteSearchListInitialState();
        
              expect({ ...action }).toEqual({
                type: autocompleteSearchListActions.SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE,
              });
        });
    });

    describe('Autocomplete Search List Failure', () => {
        it('should create an action', () => {
            const payload = new Error();
        
              const action = new autocompleteSearchListActions.AutocompleteSearchListFailure(payload);
        
              expect({ ...action }).toEqual({
                payload,
                type: autocompleteSearchListActions.USER_MANAGEMENT_AUTOCOMPLETE_SEARCH_LIST_FAILURE,
              });
        });
    });
});