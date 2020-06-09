import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { ImplementationComponent } from '../../../models/implementationComponent.model';

export const LOAD_IMPLEMENTATION_COMPONENTS_LIST = '[DMS] Load Implementation Components List';
export const LOAD_SPECIFIC_PAGE_FOR_IMPLEMENTATION_COMPONENTS_LIST = '[DMS] Load Specific Page For Implementation Components List';
export const LOAD_IMPLEMENTATION_COMPONENTS_LIST_SUCCESS = '[DMS] Load Implementation Components Success';
export const IMPLEMENTATION_COMPONENTS_LIST_FAILURE = '[DMS] Implementation Components List Failure';

export class LoadImplementationComponentsList implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENTS_LIST;
}

export class LoadSpecificPageForImplementationComponentsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_IMPLEMENTATION_COMPONENTS_LIST;
  constructor(public payload: string) { }
}

export class LoadImplementationComponentsListSuccess implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENTS_LIST_SUCCESS;
  constructor(public payload: { results: ImplementationComponent[]; pagination: IPagination }) {}
}

export class ImplementationComponentsListFailure implements Action {
  readonly type = IMPLEMENTATION_COMPONENTS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type ImplementationComponentsListActions =
  | LoadImplementationComponentsList
  | LoadSpecificPageForImplementationComponentsList
  | LoadImplementationComponentsListSuccess
  | ImplementationComponentsListFailure;
