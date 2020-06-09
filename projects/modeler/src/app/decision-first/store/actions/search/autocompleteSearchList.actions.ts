import { Action } from '@ngrx/store';
import { AutocompleteListItem, IPagination } from 'core/models';
import { 
  LoadAutocompleteSearchListSuccess as UserManagementLoadAutocompleteSearchListSuccess, 
  LoadGroupsToAutocompleteSearchList,
  LoadUsersToAutocompleteSearchList 
} from 'user-management/store/actions';
import { ObjectClassNames } from '../../../models/objects.model';
import { SearchSort } from '../../../models/search.model';

export const UPDATE_SEARCH_FOR_AUTOCOMPLETE_SEARCH_LIST = '[DMS] Update Search For Autocomplete Search List';
export const LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS = '[DMS] Load Autocomplete Search List Success';
export const SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE = '[DMS] Set Autocomplete Search List Initial State';
export const AUTOCOMPLETE_SEARCH_LIST_FAILURE = '[DMS] Autocomplete Search List Failure';
export {
  LOAD_GROUPS_TO_AUTOCOMPLETE_SEARCH_LIST, 
  LOAD_USERS_TO_AUTOCOMPLETE_SEARCH_LIST,
  LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS as USER_MANAGEMENT_LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS
} from 'user-management/store/actions';

export class UpdateSearchForAutocompleteSearchList implements Action {
  readonly type = UPDATE_SEARCH_FOR_AUTOCOMPLETE_SEARCH_LIST;
  constructor(public payload: { 
    searchTerm: string;
    objectTypes?: ObjectClassNames[];
    sort?: SearchSort;
    excludeIds?: string;
    pageSize?: number;
    fullMatchOnly?: boolean,
  }) { }
}

export class LoadAutocompleteSearchListSuccess implements Action {
  readonly type = LOAD_AUTOCOMPLETE_SEARCH_LIST_SUCCESS;
  constructor(public payload: { results: AutocompleteListItem[]; pagination: IPagination }) {}
}

export class SetAutocompleteSearchListInitialState implements Action {
  readonly type = SET_AUTOCOMPLETE_SEARCH_LIST_INITIAL_STATE;
}

export class AutocompleteSearchListFailure implements Action {
  readonly type = AUTOCOMPLETE_SEARCH_LIST_FAILURE;
  constructor(public payload: Error) { }
}

export { 
  LoadGroupsToAutocompleteSearchList, 
  LoadUsersToAutocompleteSearchList, 
  LoadAutocompleteSearchListSuccess as UserManagementLoadAutocompleteSearchListSuccess 
} from 'user-management/store/actions';

export type AutocompleteSearchListActions =
  | UpdateSearchForAutocompleteSearchList
  | LoadAutocompleteSearchListSuccess
  | SetAutocompleteSearchListInitialState
  | AutocompleteSearchListFailure
  | LoadGroupsToAutocompleteSearchList
  | LoadUsersToAutocompleteSearchList
  | UserManagementLoadAutocompleteSearchListSuccess;
