import { Action } from '@ngrx/store';
import { InputData, InputDataRelatedObjects, IInputDataUpdate } from '../../../models/inputData.model';

export const LOAD_INPUT_DATA = '[DMS] Load Input Data';
export const LOAD_INPUT_DATA_SUCCESS = '[DMS] Load Input Data Success';
export const ADD_INPUT_DATA = '[DMS] Add Input Data';
export const ADD_INPUT_DATA_SUCCESS = '[DMS] Add Input Data Success';
export const UPDATE_INPUT_DATA = '[DMS] Update Input Data';
export const DELETE_INPUT_DATA = '[DMS] Delete Input Data';
export const ADD_RELATED_OBJECT_TO_INPUT_DATA = '[DMS] Add Related Object To Input Data';
export const UPDATE_INPUT_DATA_RELATED_OBJECT = '[DMS] Update Input Data Related Object';
export const REMOVE_RELATED_OBJECT_FROM_INPUT_DATA = '[DMS] Remove Related Object From Input Data';
export const LOAD_INPUT_DATA_AS_CHILD = '[DMS] Load Input Data As Child';
export const FINISHED_NETWORK_REQUEST_FOR_INPUT_DATA = '[DMS] Finished Network Request for Input Data';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_INPUT_DATA = '[DMS] Finished Generic Network Request for Input Data';
export const INPUT_DATA_FAILURE = '[DMS] Input Data Fail';
export const GENERIC_INPUT_DATA_FAILURE = '[DMS] Generic Input Data Failure';
export const REMOVE_INPUT_DATA_FROM_LOCAL_MEMORY = '[DMS] Remove Input Data From Local Memory';
export const REMOVE_PREVIEW_INPUT_DATA_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Input Data From Local Memory';

export class LoadInputData implements Action {
  readonly type = LOAD_INPUT_DATA;
  constructor(public payload: string) { }
}

export class LoadInputDataSuccess implements Action {
  readonly type = LOAD_INPUT_DATA_SUCCESS;
  constructor(public payload: InputData) { }
}

export class AddInputData implements Action {
  readonly type = ADD_INPUT_DATA;
  constructor(
    public payload: { name: string; description: string; type: string; url: string }
  ) { }
}

export class AddInputDataSuccess implements Action {
  readonly type = ADD_INPUT_DATA_SUCCESS;
}

export class UpdateInputData implements Action {
  readonly type = UPDATE_INPUT_DATA;
  constructor(public payload: IInputDataUpdate) { }
}

export class DeleteInputData implements Action {
  readonly type = DELETE_INPUT_DATA;
  constructor(public payload: InputData) { }
}

export class AddRelatedObjectToInputData implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_INPUT_DATA;
  constructor(public payload: {
    sourceObject: InputData;
    relatedObject: InputDataRelatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateInputDataRelatedObject implements Action {
  readonly type = UPDATE_INPUT_DATA_RELATED_OBJECT;
  constructor(public payload: { object: InputDataRelatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromInputData implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_INPUT_DATA;
  constructor(public payload: {
    sourceObject: InputData;
    relatedObject: InputDataRelatedObjects;
    relationPath: string;
  }) { }
}

export class LoadInputDataAsChild implements Action {
  readonly type = LOAD_INPUT_DATA_AS_CHILD;
  constructor(public payload: string) { }
}

export class FinishedNetworkRequestForInputData implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_INPUT_DATA;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForInputData implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_INPUT_DATA;
}

export class InputDataFailure implements Action {
  readonly type = INPUT_DATA_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class GenericInputDataFailure implements Action {
  readonly type = GENERIC_INPUT_DATA_FAILURE;
  constructor(public payload: Error) { }
}

export class RemoveInputDataFromLocalMemory implements Action {
  readonly type = REMOVE_INPUT_DATA_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewInputDataFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_INPUT_DATA_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type InputDataActions =
  | LoadInputData
  | LoadInputDataSuccess
  | AddInputData
  | UpdateInputData
  | DeleteInputData
  | AddRelatedObjectToInputData
  | UpdateInputDataRelatedObject
  | RemoveRelatedObjectFromInputData
  | LoadInputDataAsChild
  | FinishedNetworkRequestForInputData
  | FinishedGenericNetworkRequestForInputData
  | InputDataFailure
  | GenericInputDataFailure
  | RemoveInputDataFromLocalMemory
  | RemovePreviewInputDataFromLocalMemory;
