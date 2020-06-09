import { Action } from '@ngrx/store';
import { VersionInformation } from 'core/models';

export const LOAD_VERSION_INFORMATION = '[CORE] Load Version Information';
export const LOAD_VERSION_INFORMATION_SUCCESS = '[CORE] Load Version Information Success';
export const UPDATE_VERSION_INFORMATION = '[CORE] Update Version Information';
export const LOAD_VERSION_INFORMATION_FAILURE = '[CORE] Load Version Information Failure';

export class LoadVersionInformation implements Action {
  readonly type = LOAD_VERSION_INFORMATION;
}

export class LoadVersionInformationSuccess implements Action {
  readonly type = LOAD_VERSION_INFORMATION_SUCCESS;
  constructor(public payload: VersionInformation) {}
}

export class UpdateVersionInformation implements Action {
  readonly type = UPDATE_VERSION_INFORMATION;
  constructor(public payload: VersionInformation) {}
}

export class VersionInformationFailure implements Action {
  readonly type = LOAD_VERSION_INFORMATION_FAILURE;
  constructor(public payload: Error) {}
}

export type VersionInformationActions =
  | LoadVersionInformation
  | LoadVersionInformationSuccess
  | UpdateVersionInformation
  | VersionInformationFailure;
