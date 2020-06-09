import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Search } from '../../../models/search.model';

export const LOAD_HOME_SEARCH_LIST = '[DMS] Load Home Search List';
export const LOAD_SPECIFIC_PAGE_FOR_HOME_SEARCH_LIST = '[DMS] Load Specific Page For Home Search List';
export const LOAD_HOME_SEARCH_LIST_SUCCESS = '[DMS] Load Home Search List Success';
export const UPDATE_SEARCH_FOR_HOME_SEARCH_LIST = '[DMS] Update Search For Home Search List';
export const HOME_SEARCH_LIST_FAILURE = '[DMS] Home Search List Failure';

export class LoadHomeSearchList implements Action {
  readonly type = LOAD_HOME_SEARCH_LIST;
}

export class LoadSpecificPageForHomeSearchList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_HOME_SEARCH_LIST;
  constructor(public payload: string) { }
}

export class LoadHomeSearchListSuccess implements Action {
  readonly type = LOAD_HOME_SEARCH_LIST_SUCCESS;
  constructor(public payload: { results: Search[]; pagination: IPagination }) {}
}

export class UpdateSearchForHomeSearchList implements Action {
  readonly type = UPDATE_SEARCH_FOR_HOME_SEARCH_LIST;
  constructor(public payload: { searchTerm: string }) {}
}

export class HomeSearchListFailure implements Action {
  readonly type = HOME_SEARCH_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type HomeActions =
  | LoadHomeSearchList
  | LoadSpecificPageForHomeSearchList
  | LoadHomeSearchListSuccess
  | UpdateSearchForHomeSearchList
  | HomeSearchListFailure;
