import { Action } from '@ngrx/store';
import { Answer, Decision, DecisionRelatedObjects, IDecisionUpdate, IDecisionCells } from '../../../models/decision.model';
import * as decisionTable from '../../../models/decisionImplementationTable.model';

export const LOAD_DECISION = '[DMS] Load Decision';
export const LOAD_DECISION_AS_CHILD = '[DMS] Load Decision As Child';
export const LOAD_DECISION_SUCCESS = '[DMS] Load Decision Success';
export const ADD_DECISION = '[DMS] Add Decision';
export const ADD_DECISION_SUCCESS = '[DMS] Add Decision Success';
export const UPDATE_DECISION = '[DMS] Update Decision';
export const DELETE_DECISION = '[DMS] Delete Decision';
export const ADD_RELATED_OBJECT_TO_DECISION = '[DMS] Add Related Object To Decision';
export const UPDATE_DECISION_RELATED_OBJECT = '[DMS] Update Decision Related Object';
export const REMOVE_RELATED_OBJECT_FROM_DECISION = '[DMS] Remove Related Object From Decision';
export const ADD_IMPLEMENTATION_TABLE_ENTITY = '[DMS] Add Implementation Table Entity';
export const UPDATE_IMPLEMENTATION_TABLE_ENTITY = '[DMS] Update Implementation Table Entity';
export const UPDATE_IMPLEMENTATION_TABLE_CELLS = '[DMS] Update Implementation Table Cells'
export const REMOVE_IMPLEMENTATION_TABLE_ENTITY = '[DMS] Remove Implementation Table Entity';
export const UPDATE_ANSWER = '[DMS] Update Answer';
export const GENERIC_DECISION_FAILURE = '[DMS] Generic Decision Failure';
export const DECISION_FAILURE = '[DMS] Decision Failure';
export const FINISHED_NETWORK_REQUEST_FOR_DECISION = '[DMS] Finished Network Access for Decision';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_DECISION = '[DMS] Finished Generic Network Access for Decision';
export const REMOVE_DECISION_FROM_LOCAL_MEMORY = '[DMS] Remove Decision From Local Memory';
export const REMOVE_PREVIEW_DECISION_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Decision From Local Memory';

export class AddDecision implements Action {
  readonly type = ADD_DECISION;
  constructor(
    public payload: {
      name: string;
      description: string;
      url: string;
      type: string;
      statusLevel: string;
      question: string;
    },
  ) { }
}

export class AddDecisionSuccess implements Action {
  readonly type = ADD_DECISION_SUCCESS;
}

export class UpdateDecision implements Action {
  readonly type = UPDATE_DECISION;
  constructor(public payload: IDecisionUpdate) { }
}

export class DeleteDecision implements Action {
  readonly type = DELETE_DECISION;
  constructor(public payload: Decision) { }
}

export class AddRelatedObjectToDecision implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_DECISION;
  constructor(public payload: {
    sourceObject: Decision;
    relatedObject: DecisionRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateDecisionRelatedObject implements Action {
  readonly type = UPDATE_DECISION_RELATED_OBJECT;
  constructor(public payload: { object: DecisionRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromDecision implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_DECISION;
  constructor(public payload: {
    sourceObject: Decision;
    relatedObject: DecisionRelatedObjects;
    relationPath: string;
  }) { }
}

export class AddImplementationTableEntity implements Action {
  readonly type = ADD_IMPLEMENTATION_TABLE_ENTITY;
  constructor(public payload: {
    sourceObject: Decision;
    relationPath: string;
    requestBody: decisionTable.AddEntityRequestBody;
  }) { }
}

export class UpdateImplementationTableEntity implements Action {
  readonly type = UPDATE_IMPLEMENTATION_TABLE_ENTITY;
  constructor(public payload: {
    sourceObject: Decision;
    relationPath: string;
    relatedObject: decisionTable.TableEntity;
  }) { }
}

export class UpdateImplementationTableCells implements Action {
  readonly type = UPDATE_IMPLEMENTATION_TABLE_CELLS;
  constructor(public payload: {
    sourceObject: Decision;
    cells: IDecisionCells[];
  }) { }
}

export class RemoveImplementationTableEntity implements Action {
  readonly type = REMOVE_IMPLEMENTATION_TABLE_ENTITY;
  constructor(public payload: {
    sourceObject: Decision;
    relationPath: string;
    relatedObjectId: string;
  }) { }
}

export class UpdateAnswer implements Action {
  readonly type = UPDATE_ANSWER;
  constructor(public payload: {
    answer: Answer,
    decision: Decision,
  }) { }
}

export class GenericDecisionFailure implements Action {
  readonly type = GENERIC_DECISION_FAILURE;
  constructor(public payload: Error) { }
}

export class DecisionFailure implements Action {
  readonly type = DECISION_FAILURE;
  constructor(
    public payload: {
      error: Error;
      id: string;
    },
  ) { }
}

export class FinishedNetworkRequestForDecision implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_DECISION;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForDecision implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_DECISION;
}

export class LoadDecision implements Action {
  readonly type = LOAD_DECISION;
  constructor(public payload: string) { }
}

export class LoadDecisionAsChild implements Action {
  readonly type = LOAD_DECISION_AS_CHILD;
  constructor(public payload: string) { }
}

export class LoadDecisionSuccess implements Action {
  readonly type = LOAD_DECISION_SUCCESS;
  constructor(public payload: Decision) { }
}

export class RemoveDecisionFromLocalMemory implements Action {
  readonly type = REMOVE_DECISION_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewDecisionFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_DECISION_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type DecisionActions =
  | AddDecision
  | UpdateDecision
  | DeleteDecision
  | AddRelatedObjectToDecision
  | UpdateDecisionRelatedObject
  | RemoveRelatedObjectFromDecision
  | AddImplementationTableEntity
  | UpdateImplementationTableEntity
  | RemoveImplementationTableEntity
  | UpdateAnswer
  | GenericDecisionFailure
  | DecisionFailure
  | FinishedNetworkRequestForDecision
  | FinishedGenericNetworkRequestForDecision
  | LoadDecision
  | LoadDecisionSuccess
  | RemoveDecisionFromLocalMemory
  | RemovePreviewDecisionFromLocalMemory;
