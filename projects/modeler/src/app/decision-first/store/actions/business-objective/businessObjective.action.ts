import { Action } from '@ngrx/store';
import { BusinessObjective, BusinessObjectiveRelatedObjects, IBusinessObjectiveUpdate } from '../../../models/businessObjective.model';

export const LOAD_BUSINESS_OBJECTIVE = '[DMS] Load Business Objective';
export const LOAD_BUSINESS_OBJECTIVE_SUCCESS = '[DMS] Load Business Objective Success';
export const ADD_BUSINESS_OBJECTIVE = '[DMS] Add Business Objective';
export const ADD_BUSINESS_OBJECTIVE_SUCCESS = '[DMS] Add Business Objective Success';
export const UPDATE_BUSINESS_OBJECTIVE = '[DMS] Update Business Objective';
export const DELETE_BUSINESS_OBJECTIVE = '[DMS] Delete Business Objective';
export const ADD_RELATED_OBJECT_TO_BUSINESS_OBJECTIVE = '[DMS] Add Related Object To Business Objective';
export const UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT = '[DMS] Update Business Objective Related Object';
export const REMOVE_RELATED_OBJECT_FROM_BUSINESS_OBJECTIVE = '[DMS] Remove Related Object From Business Objective';
export const LOAD_BUSINESS_OBJECTIVE_AS_CHILD = '[DMS] Load Business Objective As Child';
export const FINISHED_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE = '[DMS] Finished Network Request for Business Objective';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE = '[DMS] Finished Generic Network Request for Business Objective';
export const BUSINESS_OBJECTIVE_FAILURE = '[DMS] Business Objective Failure';
export const GENERIC_BUSINESS_OBJECTIVE_FAILURE = '[DMS] Generic Business Objective Failure';
export const REMOVE_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY = '[DMS] Remove Business Objective From Local Memory';
export const REMOVE_PREVIEW_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Business Objective From Local Memory';

export class LoadBusinessObjective implements Action {
  readonly type = LOAD_BUSINESS_OBJECTIVE;
  constructor(public payload: string) { }
}

export class LoadBusinessObjectiveSuccess implements Action {
  readonly type = LOAD_BUSINESS_OBJECTIVE_SUCCESS;
  constructor(public payload: BusinessObjective) { }
}

export class AddBusinessObjective implements Action {
  readonly type = ADD_BUSINESS_OBJECTIVE;
  constructor(
    public payload: { name: string; description: string; url: string }
  ) { }
}

export class AddBusinessObjectiveSuccess implements Action {
  readonly type = ADD_BUSINESS_OBJECTIVE_SUCCESS;
}

export class UpdateBusinessObjective implements Action {
  readonly type = UPDATE_BUSINESS_OBJECTIVE;
  constructor(public payload: IBusinessObjectiveUpdate) { }
}

export class DeleteBusinessObjective implements Action {
  readonly type = DELETE_BUSINESS_OBJECTIVE;
  constructor(public payload: BusinessObjective) { }
}

export class AddRelatedObjectToBusinessObjective implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_BUSINESS_OBJECTIVE;
  constructor(public payload: {
    sourceObject: BusinessObjective;
    relatedObject: BusinessObjectiveRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateBusinessObjectiveRelatedObject implements Action {
  readonly type = UPDATE_BUSINESS_OBJECTIVE_RELATED_OBJECT;
  constructor(public payload: { object: BusinessObjectiveRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromBusinessObjective implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_BUSINESS_OBJECTIVE;
  constructor(public payload: {
    sourceObject: BusinessObjective;
    relatedObject: BusinessObjectiveRelatedObjects;
    relationPath: string;
  }) { }
}

export class LoadBusinessObjectiveAsChild implements Action {
  readonly type = LOAD_BUSINESS_OBJECTIVE_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForBusinessObjective implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForBusinessObjective implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_BUSINESS_OBJECTIVE;
}

export class BusinessObjectiveFailure implements Action {
  readonly type = BUSINESS_OBJECTIVE_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericBusinessObjectiveFailure implements Action {
  readonly type = GENERIC_BUSINESS_OBJECTIVE_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveBusinessObjectiveFromLocalMemory implements Action {
  readonly type = REMOVE_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewBusinessObjectiveFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_BUSINESS_OBJECTIVE_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type BusinessObjectiveActions =
  | LoadBusinessObjective
  | LoadBusinessObjectiveSuccess
  | AddBusinessObjective
  | UpdateBusinessObjective
  | DeleteBusinessObjective
  | AddRelatedObjectToBusinessObjective
  | UpdateBusinessObjectiveRelatedObject
  | RemoveRelatedObjectFromBusinessObjective
  | LoadBusinessObjectiveAsChild
  | FinishedNetworkRequestForBusinessObjective
  | FinishedGenericNetworkRequestForBusinessObjective
  | BusinessObjectiveFailure
  | GenericBusinessObjectiveFailure
  | RemoveBusinessObjectiveFromLocalMemory
  | RemovePreviewBusinessObjectiveFromLocalMemory;
