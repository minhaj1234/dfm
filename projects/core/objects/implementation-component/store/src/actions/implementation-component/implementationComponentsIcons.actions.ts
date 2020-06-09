import { Action } from '@ngrx/store';
import { ImplementationComponentIcon, UploadImplementationComponentIconRequest } from 'core/objects/implementation-component/models';

export const LOAD_IMPLEMENTATION_COMPONENTS_ICONS = '[CORE] Load Implementation Components Icons';
export const LOAD_IMPLEMENTATION_COMPONENTS_ICONS_SUCCESS = '[CORE] Load Implementation Components Icons Success';
export const LOAD_IMPLEMENTATION_COMPONENTS_ICON = '[CORE] Load Implementation Components Icon';
export const LOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS = '[CORE] Load Implementation Components Icon Success';
export const UPDATE_IMPLEMENTATION_COMPONENTS_ICON = '[CORE] Update Implementation Components Icon';
export const DELETE_IMPLEMENTATION_COMPONENTS_ICON = '[CORE] Delete Implementation Components Icon';
export const UPLOAD_IMPLEMENTATION_COMPONENTS_ICON = '[CORE] Upload Implementation Components Icon';
export const UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS = '[CORE] Upload Implementation Components Icon Success';
export const IMPLEMENTATION_COMPONENTS_ICONS_FAILURE = '[CORE] Implementation Components Icons Failure';
export const GENERIC_IMPLEMENTATION_COMPONENTS_ICONS_FAILURE = '[CORE] Generic Implementation Components Icons Failure';
export const FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENTS_ICONS = '[CORE] Finish Network Request For Implementation Components Icons';
export const OPEN_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM = '[CORE] Open Upload Implementation Components Icon Form';
export const CLOSE_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM = '[CORE] Close Upload Implementation Components Icon Form';
export const REMOVE_IMPLEMENTATION_COMPONENTS_ICON_FROM_LOCAL_MEMORY = '[CORE] Remove Implementation Components Icon From Local Memory';

export class LoadImplementationComponentsIcons implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENTS_ICONS;
}

export class LoadImplementationComponentsIconsSuccess implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENTS_ICONS_SUCCESS;
  constructor(public payload: ImplementationComponentIcon[]) {}
}

export class LoadImplementationComponentsIcon implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENTS_ICON;
  constructor(public payload: string) {}
}

export class LoadImplementationComponentsIconSuccess implements Action {
  readonly type = LOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS;
  constructor(public payload: ImplementationComponentIcon) {}
}

export class UpdateImplementationComponentsIcon implements Action {
  readonly type = UPDATE_IMPLEMENTATION_COMPONENTS_ICON;
  constructor(public payload: ImplementationComponentIcon) {}
}

export class DeleteImplementationComponentsIcon implements Action {
  readonly type = DELETE_IMPLEMENTATION_COMPONENTS_ICON;
  constructor(public payload: string) {}
}

export class UploadImplementationComponentsIcon implements Action {
  readonly type = UPLOAD_IMPLEMENTATION_COMPONENTS_ICON;
  constructor(public payload: UploadImplementationComponentIconRequest) {}
}

export class UploadImplementationComponentsIconSuccess implements Action {
  readonly type = UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_SUCCESS;
}

export class ImplementationComponentsIconsFailure implements Action {
  readonly type = IMPLEMENTATION_COMPONENTS_ICONS_FAILURE;
  constructor(public payload: {error: Error, id: string}) {}
}

export class GenericImplementationComponentsIconsFailure implements Action {
  readonly type = GENERIC_IMPLEMENTATION_COMPONENTS_ICONS_FAILURE;
  constructor(public payload: Error) {}
}

export class FinishedNetworkRequestForImplementationComponentsIcon implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_IMPLEMENTATION_COMPONENTS_ICONS;
  constructor(public payload: string) {}
}

export class OpenUploadImplementationComponentsIconForm implements Action {
  readonly type = OPEN_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM;
}

export class CloseUploadImplementationComponentsIconForm implements Action {
  readonly type = CLOSE_UPLOAD_IMPLEMENTATION_COMPONENTS_ICON_FORM;
}

export class RemovelementationComponentIconFromLocalMemory implements Action {
  readonly type = REMOVE_IMPLEMENTATION_COMPONENTS_ICON_FROM_LOCAL_MEMORY;
  constructor(public payload: string) {}
}

export type ImplementationComponentsIconsActions =
  | LoadImplementationComponentsIcons
  | LoadImplementationComponentsIconsSuccess
  | LoadImplementationComponentsIcon
  | LoadImplementationComponentsIconSuccess
  | DeleteImplementationComponentsIcon
  | UpdateImplementationComponentsIcon
  | UploadImplementationComponentsIcon
  | UploadImplementationComponentsIconSuccess
  | ImplementationComponentsIconsFailure
  | GenericImplementationComponentsIconsFailure
  | FinishedNetworkRequestForImplementationComponentsIcon
  | OpenUploadImplementationComponentsIconForm
  | CloseUploadImplementationComponentsIconForm
  | RemovelementationComponentIconFromLocalMemory;
