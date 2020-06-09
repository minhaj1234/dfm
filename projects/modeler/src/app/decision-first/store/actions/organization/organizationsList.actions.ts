import { Action } from '@ngrx/store';
import { IPagination } from 'core/models';
import { Organization } from '../../../models/organization.model';

export const LOAD_ORGANIZATIONS_LIST = '[DMS] Load Organization List';
export const LOAD_SPECIFIC_PAGE_FOR_ORGANIZATIONS_LIST = '[DMS] Load Specific Page For Organizations List';
export const LOAD_ORGANIZATIONS_LIST_SUCCESS = '[DMS] Load Organizations List Success';
export const UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST = '[DMS] Update Search For Organizations';
export const UPDATE_SINGLE_ORGANIZATION_IF_NEEDED = '[DMS] Update Single Organization If Needed';
export const REMOVE_SINGLE_ORGANIZATION_IF_NEEDED = '[DMS] Remove Single Organization If Needed';
export const LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST = '[DMS] Load Single Organization For Organizations List';
export const LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST_SUCCESS =
  '[DMS] Add Single Organization To Organizations List Success';
export const ORGANIZATIONS_LIST_FAILURE = '[DMS] Organizations List Failure';

export class LoadOrganizationsList implements Action {
  readonly type = LOAD_ORGANIZATIONS_LIST;
}

export class LoadSpecificPageForOrganizationsList implements Action {
  readonly type = LOAD_SPECIFIC_PAGE_FOR_ORGANIZATIONS_LIST;
  constructor(public payload: string) { }
}

export class LoadOrganizationsListSuccess implements Action {
  readonly type = LOAD_ORGANIZATIONS_LIST_SUCCESS;
  constructor(public payload: { results: Organization[]; pagination: IPagination }) {}
}

export class UpdateSearchForOrganizationsList implements Action {
  readonly type = UPDATE_SEARCH_FOR_ORGANIZATIONS_LIST;
  constructor(public payload = '') {}
}

export class UpdateSingleOrganizationIfNeeded implements Action {
  readonly type = UPDATE_SINGLE_ORGANIZATION_IF_NEEDED;
  constructor(public payload: Organization) {}
}

export class RemoveSingleElementFromOrganizationsList implements Action {
  readonly type = REMOVE_SINGLE_ORGANIZATION_IF_NEEDED;
  constructor(public payload: string) {}
}

export class LoadSingleOrganizationForOrganizationsList implements Action {
  readonly type = LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST;
  constructor(public payload: string) {}
}

export class LoadSingleOrganizationForOrganizationsListSuccess implements Action {
  readonly type = LOAD_SINGLE_ORGANIZATION_FOR_ORGANIZATIONS_LIST_SUCCESS;
  constructor(public payload: Organization) {}
}

export class OrganizationsListFailure implements Action {
  readonly type = ORGANIZATIONS_LIST_FAILURE;
  constructor(public payload: Error) {}
}

export type OrganizationsListActions =
  | LoadOrganizationsList
  | LoadSpecificPageForOrganizationsList
  | LoadOrganizationsListSuccess
  | UpdateSearchForOrganizationsList
  | UpdateSingleOrganizationIfNeeded
  | RemoveSingleElementFromOrganizationsList
  | LoadSingleOrganizationForOrganizationsList
  | LoadSingleOrganizationForOrganizationsListSuccess
  | OrganizationsListFailure;
