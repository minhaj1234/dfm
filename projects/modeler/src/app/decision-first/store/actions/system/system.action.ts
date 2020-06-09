import { Action } from '@ngrx/store';
import { ISystemUpdate, System, SystemRelatedObjects } from '../../../models/system.model';

export const LOAD_SYSTEM = '[DMS] Load System';
export const LOAD_SYSTEM_SUCCESS = '[DMS] Load System Success';
export const ADD_SYSTEM = '[DMS] Add System';
export const ADD_SYSTEM_SUCCESS = '[DMS] Add System Success';
export const UPDATE_SYSTEM = '[DMS] Update System';
export const DELETE_SYSTEM = '[DMS] Delete System';
export const ADD_RELATED_OBJECT_TO_SYSTEM = '[DMS] Add Related Object To System';
export const UPDATE_SYSTEM_RELATED_OBJECT = '[DMS] Update System Related Object';
export const REMOVE_RELATED_OBJECT_FROM_SYSTEM = '[DMS] Remove Related Object From System';
export const LOAD_SYSTEM_AS_CHILD = '[DMS] Load System As Child';
export const FINISHED_NETWORK_REQUEST_FOR_SYSTEM = '[DMS] Finished Network Access for System';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_SYSTEM = '[DMS] Finished Generic Network Request for System';
export const SYSTEM_FAILURE = '[DMS] System Fail';
export const GENERIC_SYSTEM_FAILURE = '[DMS] Generic System Failure';
export const REMOVE_SYSTEM_FROM_LOCAL_MEMORY = '[DMS] Remove System From Local Memory';
export const REMOVE_PREVIEW_SYSTEM_FROM_LOCAL_MEMORY = '[DMS] Remove Preview System From Local Memory';

export class LoadSystem implements Action {
  readonly type = LOAD_SYSTEM;
  constructor(public payload: string) {}
}

export class LoadSystemSuccess implements Action {
  readonly type = LOAD_SYSTEM_SUCCESS;
  constructor(public payload: System) {}
}

export class AddSystem implements Action {
  readonly type = ADD_SYSTEM;
  constructor(
    public payload: { name: string; description: string; url: string }
  ) { }
}

export class AddSystemSuccess implements Action {
  readonly type = ADD_SYSTEM_SUCCESS;
}

export class UpdateSystem implements Action {
  readonly type = UPDATE_SYSTEM;
  constructor(public payload: ISystemUpdate) { }
}

export class DeleteSystem implements Action {
  readonly type = DELETE_SYSTEM;
  constructor(public payload: System) { }
}

export class AddRelatedObjectToSystem implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_SYSTEM;
  constructor(public payload: {
    sourceObject: System;
    relatedObject: SystemRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateSystemRelatedObject implements Action {
  readonly type = UPDATE_SYSTEM_RELATED_OBJECT;
  constructor(public payload: {object: SystemRelatedObjects, paths: string[]}) {}
}

export class RemoveRelatedObjectFromSystem implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_SYSTEM;
  constructor(public payload: {
    sourceObject: System;
    relatedObject: SystemRelatedObjects;
    relationPath: string;
  }) { }
}

export class LoadSystemAsChild implements Action {
  readonly type = LOAD_SYSTEM_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForSystem implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_SYSTEM;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForSystem implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_SYSTEM;
}

export class SystemFailure implements Action {
  readonly type = SYSTEM_FAILURE;
  constructor(public payload: { id: string; error: Error }) {}
}

export class GenericSystemFailure implements Action {
  readonly type = GENERIC_SYSTEM_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveSystemFromLocalMemory implements Action {
  readonly type = REMOVE_SYSTEM_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewSystemFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_SYSTEM_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type SystemActions = 
  | LoadSystem
  | LoadSystemSuccess
  | AddSystem
  | UpdateSystem
  | DeleteSystem
  | AddRelatedObjectToSystem
  | UpdateSystemRelatedObject
  | RemoveRelatedObjectFromSystem
  | LoadSystemAsChild
  | FinishedNetworkRequestForSystem
  | FinishedGenericNetworkRequestForSystem
  | SystemFailure
  | GenericSystemFailure
  | RemoveSystemFromLocalMemory
  | RemovePreviewSystemFromLocalMemory;
