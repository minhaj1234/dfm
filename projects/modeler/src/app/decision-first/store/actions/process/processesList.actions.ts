import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Process } from '../../../models/process.model';

export const LOAD_PROCESSES_LIST = '[DMS] Load Processes List';
export const LOAD_SPECIFIC_PAGE_FOR_PROCESSES_LIST = '[DMS] Load Specific Page For Processes List';
export const LOAD_PROCESSES_LIST_SUCCESS = '[DMS] Load Processes List Success';
export const PROCESSES_LIST_FAILURE = '[DMS] Processes List Failure';

export class LoadProcessesList implements Action {
  readonly type = LOAD_PROCESSES_LIST;
}

export class LoadSpecificPageForProcessesList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_PROCESSES_LIST;
  constructor(public payload: string) { }
}

export class LoadProcessesListSuccess implements Action {
  readonly type = LOAD_PROCESSES_LIST_SUCCESS;
  constructor(public payload: { results: Process[]; pagination: IPagination }) {}
}

export class ProcessesListFailure implements Action {
  readonly type = PROCESSES_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type ProcessesListActions = 
  | LoadProcessesList
  | LoadSpecificPageForProcessesList
  | LoadProcessesListSuccess
  | ProcessesListFailure;
