import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Decision } from '../../../models/decision.model';

export const LOAD_DECISIONS_LIST = '[DMS] Load Decisions List';
export const LOAD_SPECIFIC_PAGE_FOR_DECISIONS_LIST = '[DMS] Load Specific Page For Decisions List';
export const LOAD_DECISIONS_LIST_SUCCESS = '[DMS] Load Decisions List Success';
export const UPDATE_SEARCH_FOR_DECISIONS_LIST = '[DMS] Update Search For Decisions List';
export const LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST = '[DMS] Load Single Decision For Decisions List';
export const LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST_SUCCESS = '[DMS] Add Single Decision To Decisions List Success';
export const REMOVE_SINGLE_DECISION_FROM_DECISIONS_LIST = '[DMS] Remove Single Decision From Decisions List';
export const DECISIONS_LIST_FAILURE = '[DMS] Decisions List Failure';

export class LoadDecisionsList implements Action {
  readonly type = LOAD_DECISIONS_LIST;
}

export class LoadSpecificPageForDecisionsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_DECISIONS_LIST;
  constructor(public payload: string) { }
}

export class LoadDecisionsListSuccess implements Action {
  readonly type = LOAD_DECISIONS_LIST_SUCCESS;
  constructor(public payload: { results: Decision[]; pagination: IPagination }) {}
}

export class UpdateSearchForDecisionsList implements Action {
  readonly type = UPDATE_SEARCH_FOR_DECISIONS_LIST;
  constructor(public payload = '') {}
}

export class LoadSingleDecisionForDecisionsList implements Action {
  readonly type = LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST;
  constructor(public payload: string) {}
}

export class LoadSingleDecisionForDecisionsListSuccess implements Action {
  readonly type = LOAD_SINGLE_DECISION_FOR_DECISIONS_LIST_SUCCESS;
  constructor(public payload: Decision) {}
}

export class RemoveSingleDecisionFromDecisionsList implements Action {
  readonly type = REMOVE_SINGLE_DECISION_FROM_DECISIONS_LIST;
  constructor(public payload: string) {}
}

export class DecisionsListFailure implements Action {
  readonly type = DECISIONS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type DecisionsListActions =
  | UpdateSearchForDecisionsList
  | LoadDecisionsList
  | LoadSpecificPageForDecisionsList
  | LoadDecisionsListSuccess
  | LoadSingleDecisionForDecisionsList
  | LoadSingleDecisionForDecisionsListSuccess
  | RemoveSingleDecisionFromDecisionsList
  | DecisionsListFailure;
