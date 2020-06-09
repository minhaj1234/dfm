import { createSelector } from '@ngrx/store';
import { Organization } from '../../../models/organization.model';
import * as fromFeature from '../../reducers';
import * as fromOrganizations from '../../reducers/organization/organization.reducer';

export const getOrganizationsState = createSelector(
  fromFeature.getDecisionFirstState,
  (state: fromFeature.IDecisionFirstState) => state.organizations,
);

export const getLoadedOrganizations = createSelector(getOrganizationsState, fromOrganizations.selectEntities);

export const getLoadedOrganizationsAsArray = createSelector(getOrganizationsState, fromOrganizations.selectAll);

export const getOrganizationsAnyNetworkActive = createSelector(
  getOrganizationsState,
  fromOrganizations.selectAnyNetworkActive,
);

export const getSelectedOrganization = (id) =>
  createSelector(getOrganizationsState, (organizationState): Organization => organizationState.entities[id]);

export const getLoadedOrganizationsInputData = createSelector(
  getLoadedOrganizationsAsArray,
  (organizations: Organization[]) => {
    return [].concat.apply([], organizations.map((organization: Organization) => [...organization.inputDatas]));
  },
);

export const getLoadedOrganizationsDecisions = createSelector(
  getLoadedOrganizationsAsArray,
  (organizations: Organization[]) => {
    return [].concat.apply([], organizations.map((organization: Organization) => [
      ...organization.ownsDecisions,
      ...organization.makesDecisions,
      ...organization.impactedByDecisions,
    ]));
  },
);

export const getLoadedOrganizationsKnowledgeSources = createSelector(
  getLoadedOrganizationsAsArray,
  (organizations: Organization[]) => {
    return [].concat.apply([], organizations.map((organization: Organization) => [...organization.knowledgeSources]));
  },
);

export const getLoadedOrganizationsOrganizations = createSelector(
  getLoadedOrganizationsAsArray,
  (organizations: Organization[]) => {
    return [].concat.apply([], organizations.map((organization: Organization) => {
      return [
        organization.parentOrganization,
        ...organization.childOrganizations,
      ]
    }));
  },
);

export const getLoadedOrganizationsBusinessObjectives = createSelector(
  getLoadedOrganizationsAsArray,
  (organizations: Organization[]) => {
    return [].concat.apply([], organizations.map((organization: Organization) => [...organization.businessObjectives]));
  },
);

export const getSelectedOrganizationNetworkActive = (id) =>
  createSelector(getOrganizationsState, (organizationState): boolean => organizationState.networkActive[id] || false);
