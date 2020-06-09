import { Action } from '@ngrx/store';
import { IProcessUpdate, Process, ProcessRelatedObjects } from '../../../models/process.model';

export const LOAD_PROCESS = '[DMS] Load Process';
export const LOAD_PROCESS_SUCCESS = '[DMS] Load Process Success';
export const ADD_PROCESS = '[DMS] Add Process';
export const ADD_PROCESS_SUCCESS = '[DMS] Add Process Success';
export const UPDATE_PROCESS = '[DMS] Update Process';
export const DELETE_PROCESS = '[DMS] Delete Process';
export const ADD_RELATED_OBJECT_TO_PROCESS = '[DMS] Add Related Object To Process';
export const UPDATE_PROCESS_RELATED_OBJECT = '[DMS] Update Process Related Object';
export const REMOVE_RELATED_OBJECT_FROM_PROCESS = '[DMS] Remove Related Object From Process';
export const LOAD_PROCESS_AS_CHILD = '[DMS] Load Process As Child';
export const FINISHED_NETWORK_REQUEST_FOR_PROCESS = '[DMS] Finished Network Request for Process';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_PROCESS = '[DMS] Finished Generic Network Request for Process';
export const PROCESS_FAILURE = '[DMS] Process Fail';
export const GENERIC_PROCESS_FAILURE = '[DMS] Generic Process Failure';
export const REMOVE_PROCESS_FROM_LOCAL_MEMORY = '[DMS] Remove Process From Local Memory';
export const REMOVE_PREVIEW_PROCESS_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Process From Local Memory';

export class LoadProcess implements Action {
  readonly type = LOAD_PROCESS;
  constructor(public payload: string) { }
}

export class LoadProcessSuccess implements Action {
  readonly type = LOAD_PROCESS_SUCCESS;
  constructor(public payload: Process) { }
}

export class AddProcess implements Action {
  readonly type = ADD_PROCESS;
  constructor(
    public payload: { name: string; description: string; url: string }
  ) { }
}

export class AddProcessSuccess implements Action {
  readonly type = ADD_PROCESS_SUCCESS;
}

export class UpdateProcess implements Action {
  readonly type = UPDATE_PROCESS;
  constructor(public payload: IProcessUpdate) { }
}

export class DeleteProcess implements Action {
  readonly type = DELETE_PROCESS;
  constructor(public payload: Process) { }
}

export class AddRelatedObjectToProcess implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_PROCESS;
  constructor(public payload: {
    sourceObject: Process;
    relatedObject: ProcessRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateProcessRelatedObject implements Action {
  readonly type = UPDATE_PROCESS_RELATED_OBJECT;
  constructor(public payload: { object: ProcessRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromProcess implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_PROCESS;
  constructor(public payload: {
    sourceObject: Process;
    relatedObject: ProcessRelatedObjects;
    relationPath: string;
  }) { }
}

export class LoadProcessAsChild implements Action {
  readonly type = LOAD_PROCESS_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForProcess implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_PROCESS;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForProcess implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_PROCESS;
}

export class ProcessFailure implements Action {
  readonly type = PROCESS_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericProcessFailure implements Action {
  readonly type = GENERIC_PROCESS_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveProcessFromLocalMemory implements Action {
  readonly type = REMOVE_PROCESS_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewProcessFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_PROCESS_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type ProcessActions =
  | LoadProcess
  | LoadProcessSuccess
  | AddProcess
  | UpdateProcess
  | DeleteProcess
  | AddRelatedObjectToProcess
  | UpdateProcessRelatedObject
  | RemoveRelatedObjectFromProcess
  | LoadProcessAsChild
  | FinishedNetworkRequestForProcess
  | FinishedGenericNetworkRequestForProcess
  | ProcessFailure
  | GenericProcessFailure
  | RemoveProcessFromLocalMemory
  | RemovePreviewProcessFromLocalMemory;
