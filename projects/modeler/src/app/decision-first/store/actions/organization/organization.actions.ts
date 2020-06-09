import { Action } from '@ngrx/store';
import { IOrganizationUpdate, Organization, OrganizationRelalatedObjects } from '../../../models/organization.model';

export const LOAD_ORGANIZATION = '[DMS] Load Organization';
export const LOAD_ORGANIZATION_SUCCESS = '[DMS] Load Organization Success';
export const UPDATE_ORGANIZATION = '[DMS] Update Organization';
export const ADD_ORGANIZATION = '[DMS] Add Organization';
export const ADD_ORGANIZATION_SUCCESS = '[DMS] Add Organization Success';
export const DELETE_ORGANIZATION = '[DMS] Delete Organization';
export const ADD_RELATED_OBJECT_TO_ORGANIZATION = '[DMS] Add Related Object To Organization';
export const UPDATE_ORGANIZATION_RELATED_OBJECT = '[DMS] Update Organization Related Object';
export const REMOVE_RELATED_OBJECT_FROM_ORGANIZATION = '[DMS] Remove Related Object From Organization';
export const LOAD_ORGANIZATION_AS_CHILD = '[DMS] Load Organization As Child';
export const ORGANIZATION_FAILURE = '[DMS] Organization Fail';
export const FINISHED_NETWORK_REQUEST_FOR_ORGANIZATION = '[DMS] Finished Network Access for Organization';
export const FINISHED_GENERIC_NETWORK_REQUEST_FOR_ORGANIZATION = '[DMS] Finished Generic Network Request for Organization';
export const REMOVE_ORGANIZATION_FROM_LOCAL_MEMORY = '[DMS] Remove Organization From Local Memory';
export const REMOVE_PREVIEW_ORGANIZATION_FROM_LOCAL_MEMORY = '[DMS] Remove Preview Organization From Local Memory';

export class LoadOrganization implements Action {
  readonly type = LOAD_ORGANIZATION;
  constructor(public payload: string) { }
}

export class LoadOrganizationSuccess implements Action {
  readonly type = LOAD_ORGANIZATION_SUCCESS;
  constructor(public payload: Organization) { }
}

export class UpdateOrganization implements Action {
  readonly type = UPDATE_ORGANIZATION;
  constructor(public payload: IOrganizationUpdate) { }
}

export class AddOrganization implements Action {
  readonly type = ADD_ORGANIZATION;
  constructor(public payload: { name: string; description: string; type: string; url: string }) { }
}

export class AddOrganizationSuccess implements Action {
  readonly type = ADD_ORGANIZATION_SUCCESS;
}

export class DeleteOrganization implements Action {
  readonly type = DELETE_ORGANIZATION;
  constructor(public payload: Organization) { }
}

export class AddRelatedObjectToOrganization implements Action {
  readonly type = ADD_RELATED_OBJECT_TO_ORGANIZATION;
  constructor(public payload: {
    sourceObject: Organization;
    relatedObject: OrganizationRelalatedObjects;
    relationPath: string;
  }) { }
}

export class UpdateOrganizationRelatedObject implements Action {
  readonly type = UPDATE_ORGANIZATION_RELATED_OBJECT;
  constructor(public payload: { object: OrganizationRelalatedObjects, paths: string[] }) { }
}

export class RemoveRelatedObjectFromOrganization implements Action {
  readonly type = REMOVE_RELATED_OBJECT_FROM_ORGANIZATION;
  constructor(public payload: {
    sourceObject: Organization;
    relatedObject: OrganizationRelalatedObjects;
    relationPath: string;
  }) { }
}

export class LoadOrganizationAsChild implements Action {
  readonly type = LOAD_ORGANIZATION_AS_CHILD;
  constructor(public payload: string) { }
}

export class OrganizationFailure implements Action {
  readonly type = ORGANIZATION_FAILURE;
  constructor(public payload: { id: string; error: Error }) { }
}

export class FinishedNetworkRequestForOrganization implements Action {
  readonly type = FINISHED_NETWORK_REQUEST_FOR_ORGANIZATION;
  constructor(public payload: string) { }
}

export class FinishedGenericNetworkRequestForOrganization implements Action {
  readonly type = FINISHED_GENERIC_NETWORK_REQUEST_FOR_ORGANIZATION;
}

export class RemoveOrganizationFromLocalMemory implements Action {
  readonly type = REMOVE_ORGANIZATION_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export class RemovePreviewOrganizationFromLocalMemory implements Action {
  readonly type = REMOVE_PREVIEW_ORGANIZATION_FROM_LOCAL_MEMORY;
  constructor(public payload: string) { }
}

export type OrganizationActions =
  | LoadOrganization
  | OrganizationFailure
  | LoadOrganizationSuccess
  | AddOrganization
  | DeleteOrganization
  | AddRelatedObjectToOrganization
  | UpdateOrganizationRelatedObject
  | RemoveRelatedObjectFromOrganization
  | LoadOrganizationAsChild
  | FinishedNetworkRequestForOrganization
  | FinishedGenericNetworkRequestForOrganization
  | UpdateOrganization
  | RemoveOrganizationFromLocalMemory
  | RemovePreviewOrganizationFromLocalMemory;
