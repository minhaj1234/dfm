import { Action } from '@ngrx/store';
import { AutocompleteListItem } from 'core/models';

export const LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST = '[ADMIN] Load Groups To Autocomplete Search List';
export const LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST = '[ADMIN] Load Users To Autocomplete Search List';
export const LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS = '[ADMIN] Load Autocomplete Search List Success';
export const SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE = '[ADMIN] Set Autocomplete Search List Initial State';
export const USER_MANAGEMENT_AUTOCOMPLETE_SEARCH_LIST_FAILURE = '[ADMIN] User Management Autocomplete Search List Failure';

export class LoadGroupsToAutocompleteSearchList implements Action {
  readonly type = LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST;
  constructor(public payload: { 
    accountId: string;
    searchTerm: string;
    pageNumber: number;
    pageSize: number;
  }) { }
}

export class LoadUsersToAutocompleteSearchList implements Action {
  readonly type = LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST;
  constructor(public payload: { 
    accountId: string;
    searchTerm: string;
    pageNumber: number;
    pageSize: number;
  }) { }
}

export class LoadAutocompleteSearchListSuccess implements Action {
    readonly type = LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS;
    constructor(public payload: { results: AutocompleteListItem[]}) {}
}

export class SetAutocompleteSearchListInitialState implements Action {
  readonly type = SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE;
}

export class AutocompleteSearchListFailure implements Action {
  readonly type = USER_MANAGEMENT_AUTOCOMPLETE_SEARCH_LIST_FAILURE;
  constructor(public payload: Error) { }
}

export type AutocompleteSearchListActions = 
  | LoadGroupsToAutocompleteSearchList 
  | LoadUsersToAutocompleteSearchList
  | LoadAutocompleteSearchListSuccess
  | SetAutocompleteSearchListInitialState
  | AutocompleteSearchListFailure;
  