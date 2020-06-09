import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { ObjectClassNames } from '../../../models/objects.model';
import { Search, SearchSort } from '../../../models/search.model';

export const LOAD_MAIN_SEARCH_LIST = '[DMS] Load Main Search List';
export const LOAD_SPECIFIC_PAGE_FOR_MAIN_SEARCH_LIST = '[DMS] Load Specific Page For Main Search List';
export const LOAD_MAIN_SEARCH_LIST_SUCCESS = '[DMS] Load Main Search List Success';
export const UPDATE_SEARCH_FOR_MAIN_SEARCH_LIST = '[DMS] Update Search For Main Search List';
export const GET_MAIN_SEARCH_LIST_INITIAL_STATE = '[DMS] Get Main Search List Initial State';
export const MAIN_SEARCH_LIST_FAILURE = '[DMS] Search List Failure';

export class LoadMainSearchList implements Action {
  readonly type = LOAD_MAIN_SEARCH_LIST;
}

export class LoadSpecificPageForMainSearchList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_MAIN_SEARCH_LIST;
  constructor(public payload: string) { }
}

export class LoadMainSearchListSuccess implements Action {
  readonly type = LOAD_MAIN_SEARCH_LIST_SUCCESS;
  constructor(public payload: { results: Search[]; pagination: IPagination }) {}
}

export class UpdateSearchForMainSearchList implements Action {
  readonly type = UPDATE_SEARCH_FOR_MAIN_SEARCH_LIST;
  constructor(public payload: { searchTerm: string; sort?: SearchSort; typeObjects?: ObjectClassNames[] }) {}
}

export class GetMainSearchListInitialState implements Action {
  readonly type = GET_MAIN_SEARCH_LIST_INITIAL_STATE;
}

export class MainSearchListFailure implements Action {
  readonly type = MAIN_SEARCH_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type SearchListActions =
  | LoadMainSearchList
  | LoadSpecificPageForMainSearchList
  | LoadMainSearchListSuccess
  | UpdateSearchForMainSearchList
  | GetMainSearchListInitialState
  | MainSearchListFailure;
