import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Tag } from '../../../models/tag.model';

export const LOAD_TAGS_LIST = '[DMS] Load All Tags';
export const LOAD_SPECIFIC_PAGE_FOR_TAGS_LIST = '[DMS] Load Specific Page For Systems List';
export const LOAD_TAGS_LIST_SUCCESS = '[DMS] Load All Tags Success';
export const TAGS_LIST_FAILURE = '[DMS] Tags List Failure';
export const SET_INITIAL_STATE_TAGS_LIST = '[DMS] Set Initial State Tags List';

export class LoadTagsList implements Action {
  readonly type = LOAD_TAGS_LIST;
}

export class LoadSpecificPageForTagsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_TAGS_LIST;
  constructor(public payload: string) { }
}

export class LoadTagsListSuccess implements Action {
  readonly type = LOAD_TAGS_LIST_SUCCESS;
  constructor(public payload: { results: Tag[]; pagination: IPagination }) { }
}

export class TagsListFailure implements Action {
  readonly type = TAGS_LIST_FAILURE;
  constructor(public payload: Error) { }
}

export class SetInitialStateTagsList implements Action {
  readonly type = SET_INITIAL_STATE_TAGS_LIST;
}

export type TagsListActions = 
  | LoadTagsList
  | LoadSpecificPageForTagsList
  | LoadTagsListSuccess
  | TagsListFailure
  | SetInitialStateTagsList;
