import { createSelector } from '@ngrx/store';
import { Organization } from '../../../models/organization.model';
import * as fromFeature from '../../reducers';
import * as fromOrganizationsList from '../../reducers/organization/organizationsList.reducer';

export const getOrganizationsListState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.organizationsList,
);

export const getOrganizationsList = createSelector(getOrganizationsListState, fromOrganizationsList.selectAll);
export const getOrganizationsListNetworkActive = createSelector(
  getOrganizationsListState,
  fromOrganizationsList.selectAnyNetworkActive,
);
export const getOrganizationsEntities = createSelector(getOrganizationsListState, fromOrganizationsList.selectEntities);

export const getOrganizationsListPagination = createSelector(
  getOrganizationsListState,
  fromOrganizationsList.getPagination,
);

export const getOrganizationsListSearchTerm = createSelector(
  getOrganizationsListState,
  fromOrganizationsList.getSearchTerm,
);

export const getSelectedOrganizationFromOrganizationsList = (id) =>
  createSelector(getOrganizationsListState, (organizationState): Organization => organizationState.entities[id]);
