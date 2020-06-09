import { Action } from '@ngrx/store';
import { ImplementationComponent, ImplementationComponentRelatedObjects, IImplementationComponentUpdate } from '../../../models/implementationComponent.model';

export const LOAD_IMPLEMENTATION_COMPONENT = '[DMS] Load Implementation Component';
export const LOAD_IMPLEMENTATION_COMPONENT_SUCCESS = '[DMS] Load Implementation Component Success';
export const ADD_IMPLEMENTATION_COMPONENT = '[DMS] Add Implementation Component';
export const ADD_IMPLEMENTATION_COMPONENT_SUCCESS = '[DMS] Add Implementation Component Success';
export const UPDATE_IMPLEMENTATION_COMPONENT = '[DMS] Update Implementation Component';
export const DELETE_IMPLEMENTATION_COMPONENT = '[DMS] Delete Implementation Component';
export const ADD_RELATED_OBJECT_TO_IMPLEMENTATION_COMPONENT = '[DMS] Add Related Object To Implementation Component';
export const UPDATE_IMPLEMENTATION_COMPONENT_RELATED_OBJECT = '[DMS] Update Implementation Component Related Object';
export const REMOVE_RELATED_OBJECT_FROM_IMPLEMENTATION_COMPONENT = '[DMS] Remove Related Object From Implementation Component';
export const LOAD_IMPLEMENTATION_COMPONENT_AS_CHILD = '[DMS] Load Implementation Component As Child';
export const FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT = '[DMS] Finished Network Request for Implementation Component';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT = '[DMS] Finished Generic Network Request for Implementation Component';
export const IMPLEMENTATION_COMPONENT_FAILURE = '[DMS] Implementation Component Failure';
export const GENERIC_IMPLEMENTATION_COMPONENT_FAILURE = '[DMS] Generic System Failure';
export const REMOVE_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY = '[DMS] Remove Implementation Component From Local Memory';
export const REMOVE_PREVIEW_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Implementation Component From Local Memory';

export class LoadImplementationComponent implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENT;
  constructor(public payload: string) { }
}

export class LoadImplementationComponentSuccess implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENT_SUCCESS;
  constructor(public payload: ImplementationComponent) { }
}

export class AddImplementationComponent implements Action {
  readonly type = ADD_IMPLEMENTATION_COMPONENT;
  constructor(
    public payload: { name: string; description: string; url: string, iconId: string }
  ) { }
}

export class AddImplementationComponentSuccess implements Action {
  readonly type = ADD_IMPLEMENTATION_COMPONENT_SUCCESS;
}

export class UpdateImplementationComponent implements Action {
  readonly type = UPDATE_IMPLEMENTATION_COMPONENT;
  constructor(public payload: IImplementationComponentUpdate) { }
}

export class DeleteImplementationComponent implements Action {
  readonly type = DELETE_IMPLEMENTATION_COMPONENT;
  constructor(public payload: ImplementationComponent) { }
}

export class AddRelatedObjectToImplementationComponent implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_IMPLEMENTATION_COMPONENT;
  constructor(public payload: {
    sourceObject: ImplementationComponent;
    relatedObject: ImplementationComponentRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateImplementationComponentRelatedObject implements Action {
  readonly type = UPDATE_IMPLEMENTATION_COMPONENT_RELATED_OBJECT;
  constructor(public payload: { object: ImplementationComponentRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromImplementationComponent implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_IMPLEMENTATION_COMPONENT;
  constructor(public payload: {
    sourceObject: ImplementationComponent;
    relatedObject: ImplementationComponentRelatedObjects;
    relationPath: string;
  }) { }
}

export class LoadImplementationComponentAsChild implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENT_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForImplementationComponent implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForImplementationComponent implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENT;
}

export class ImplementationComponentFailure implements Action {
  readonly type = IMPLEMENTATION_COMPONENT_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericImplementationComponentFailure implements Action {
  readonly type = GENERIC_IMPLEMENTATION_COMPONENT_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveImplementationComponentFromLocalMemory implements Action {
  readonly type = REMOVE_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewImplementationComponentFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_IMPLEMENTATION_COMPONENT_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type ImplementationComponentActions =
  | LoadImplementationComponent
  | LoadImplementationComponentSuccess
  | AddImplementationComponent
  | UpdateImplementationComponent
  | DeleteImplementationComponent
  | AddRelatedObjectToImplementationComponent
  | UpdateImplementationComponentRelatedObject
  | RemoveRelatedObjectFromImplementationComponent
  | LoadImplementationComponentAsChild
  | FinishedNetworkRequestForImplementationComponent
  | FinishedGenericNetworkRequestForImplementationComponent
  | ImplementationComponentFailure
  | GenericImplementationComponentFailure
  | RemoveImplementationComponentFromLocalMemory
  | RemovePreviewImplementationComponentFromLocalMemory;
