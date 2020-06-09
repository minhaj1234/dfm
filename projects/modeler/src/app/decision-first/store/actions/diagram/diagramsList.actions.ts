import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Diagram } from '../../../models/diagram.model';

export const LOAD_DIAGRAMS_LIST = '[DMS] Load Diagrams List';
export const LOAD_SPECIFIC_PAGE_FOR_DIAGRAMS_LIST = '[DMS] Load Specific Page For Diagrams List';
export const LOAD_DIAGRAMS_LIST_SUCCESS = '[DMS] Load Diagrams List Success';
export const UPDATE_SEARCH_FOR_DIAGRAMS_LIST = '[DMS] Update Search For Diagrams List';
export const LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST = '[DMS] Load Single Diagram For Diagrams List';
export const LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST_SUCCESS = '[DMS] Add Single Diagram To Diagrams List Success';
export const REMOVE_SINGLE_DIAGRAM_FROM_DIAGRAMS_LIST = '[DMS] Remove Single Diagram From Diagrams List';
export const DIAGRAMS_LIST_FAILURE = '[DMS] Diagrams List Failure';

export class LoadDiagramsList implements Action {
  readonly type = LOAD_DIAGRAMS_LIST;
}

export class LoadSpecificPageForDiagramsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_DIAGRAMS_LIST;
  constructor(public payload: string) { }
}

export class LoadDiagramsListSuccess implements Action {
  readonly type = LOAD_DIAGRAMS_LIST_SUCCESS;
  constructor(public payload: { results: Diagram[]; pagination: IPagination }) {}
}

export class UpdateSearchForDiagramsList implements Action {
  readonly type = UPDATE_SEARCH_FOR_DIAGRAMS_LIST;
  constructor(public payload = '') {}
}

export class LoadSingleDiagramForDiagramsList implements Action {
  readonly type = LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST;
  constructor(public payload: string) {}
}

export class LoadSingleDiagramForDiagramsListSuccess implements Action {
  readonly type = LOAD_SINGLE_DIAGRAM_FOR_DIAGRAMS_LIST_SUCCESS;
  constructor(public payload: Diagram) {}
}

export class RemoveSingleDiagramFromDiagramsList implements Action {
  readonly type = REMOVE_SINGLE_DIAGRAM_FROM_DIAGRAMS_LIST;
  constructor(public payload: string) {}
}

export class DiagramsListFailure implements Action {
  readonly type = DIAGRAMS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type DiagramsListActions =
  | LoadDiagramsList
  | LoadSpecificPageForDiagramsList
  | LoadDiagramsListSuccess
  | UpdateSearchForDiagramsList
  | LoadSingleDiagramForDiagramsList
  | LoadSingleDiagramForDiagramsListSuccess
  | RemoveSingleDiagramFromDiagramsList
  | DiagramsListFailure;
