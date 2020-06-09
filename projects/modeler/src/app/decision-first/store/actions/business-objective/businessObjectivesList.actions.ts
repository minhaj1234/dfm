import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { BusinessObjective } from '../../../models/businessObjective.model';

export const LOAD_BUSINESS_OBJECTIVES_LIST = '[DMS] Load Business Objectives List';
export const LOAD_SPECIFIC_PAGE_FOR_BUSINESS_OBJECTIVES_LIST = '[DMS] Load Specific Page For Business Objectives List';
export const LOAD_BUSINESS_OBJECTIVES_LIST_SUCCESS = '[DMS] Load Business Objectives List Success';
export const BUSINESS_OBJECTIVES_LIST_FAILURE = '[DMS] Business Objectives List Failure';

export class LoadBusinessObjectivesList implements Action {
  readonly type = LOAD_BUSINESS_OBJECTIVES_LIST;
}

export class LoadSpecificPageForBusinessObjectivesList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_BUSINESS_OBJECTIVES_LIST;
  constructor(public payload: string) { }
}

export class LoadBusinessObjectivesListSuccess implements Action {
  readonly type = LOAD_BUSINESS_OBJECTIVES_LIST_SUCCESS;
  constructor(public payload: { results: BusinessObjective[]; pagination: IPagination }) {}
}

export class BusinessObjectivesListFailure implements Action {
  readonly type = BUSINESS_OBJECTIVES_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type BusinessObjectivesListActions =
  | LoadBusinessObjectivesList
  | LoadSpecificPageForBusinessObjectivesList
  | LoadBusinessObjectivesListSuccess
  | BusinessObjectivesListFailure;
