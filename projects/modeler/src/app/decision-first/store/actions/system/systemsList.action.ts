import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { System } from '../../../models/system.model';

export const LOAD_SYSTEMS_LIST = '[DMS] Load Systems List';
export const LOAD_SPECIFIC_PAGE_FOR_SYSTEMS_LIST = '[DMS] Load Specific Page For Systems List';
export const LOAD_SYSTEMS_LIST_SUCCESS = '[DMS] Load Systems List Success';
export const SYSTEMS_LIST_FAILURE = '[DMS] Systems List Failure';

export class LoadSystemsList implements Action {
  readonly type = LOAD_SYSTEMS_LIST;
}

export class LoadSystemsListSuccess implements Action {
  readonly type = LOAD_SYSTEMS_LIST_SUCCESS;
  constructor(public payload: { results: System[]; pagination: IPagination }) {}
}

export class LoadSpecificPageForSystemsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_SYSTEMS_LIST;
  constructor(public payload: string) { }
}

export class SystemsListFailure implements Action {
  readonly type = SYSTEMS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type SystemsListActions = 
  | LoadSystemsList
  | LoadSpecificPageForSystemsList
  | LoadSystemsListSuccess
  | SystemsListFailure;
